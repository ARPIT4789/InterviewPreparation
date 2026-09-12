import express from "express";
import Kit from "../models/Kit.js";
import { generateKit } from "../services/kit-generation.service.js";
import { requireAuth } from "../middleware/auth.js";
import {
  regenerateQuestions,
  regenerateFlashcardSection,
  regenerateScheduleSection
} from "../services/regenerate.service.js";

const router = express.Router();


// GET ALL KITS FOR CURRENT USER
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const kits = await Kit.find({
      userId: req.session.userId
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      kits
    });
  } catch (error) {
    next(error);
  }
});


router.delete("/:kitId", requireAuth, async (req, res) => {
  try {
    const { kitId } = req.params;

    const deletedKit = await Kit.findOneAndDelete({
      _id: kitId,
      userId: req.session.userId,
    });

    if (!deletedKit) {
      return res.status(404).json({
        error: {
          message: "Kit not found or you do not have access to it.",
        },
      });
    }

    return res.status(200).json({
      message: "Kit deleted successfully.",
    });
  } catch (error) {
    console.error("Delete kit error:", error);

    return res.status(500).json({
      error: {
        message: "Failed to delete kit.",
      },
    });
  }
});


// GET ONE KIT
router.get("/:kitId", requireAuth, async (req, res, next) => {
  try {
    const kit = await Kit.findOne({
      _id: req.params.kitId,
      userId: req.session.userId
    }).lean();

    if (!kit) {
      return res.status(404).json({
        success: false,
        error: {
          code: "KIT_NOT_FOUND",
          message: "Kit not found."
        }
      });
    }

    res.json({
      success: true,
      kit
    });
  } catch (error) {
    next(error);
  }
});


// CREATE KIT
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const {
      jd,
      company_url,
      days
    } = req.body;

    if (!jd || !jd.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_JD",
          message: "Job description is required."
        }
      });
    }

    if (!company_url || !company_url.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_COMPANY_URL",
          message: "Company website is required."
        }
      });
    }

    if (
      !Number.isInteger(days) ||
      days < 1 ||
      days > 60
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_DAYS",
          message: "Days must be an integer between 1 and 60."
        }
      });
    }

    const kit = await Kit.create({
      userId: req.session.userId,

      source: {
        company: "",
        company_url: company_url.trim(),
        role: "",
        location: "",
        jd_chars: jd.length,
        researched_at: "",
        pages_used: []
      },

      company_brief: {
        summary: "",
        what_they_do: "",
        sources: []
      },

      role: {
        title: "",
        seniority: "",
        responsibilities: [],
        requirements: []
      },

      questions: [],

      flashcards: [],

      schedule: {
        days_available: days,
        days: []
      },

      coverage: {
        uncovered_requirement_ids: [],
        passes: 0
      }
    });

    res.status(201).json({
      success: true,
      kit
    });
  } catch (error) {
    next(error);
  }
});

router.post("/generate", requireAuth, async (req, res, next) => {
  try {
    const { jd, company_url, days } = req.body;

    if (!jd || typeof jd !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_JD",
          message: "Job description is required."
        }
      });
    }

    if (!company_url || typeof company_url !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_COMPANY_URL",
          message: "Company URL is required."
        }
      });
    }

    if (
      !Number.isInteger(days) ||
      days < 1 ||
      days > 60
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_DAYS",
          message: "Days must be an integer between 1 and 60."
        }
      });
    }



    const result = await generateKit({
      jd,
      companyUrl: company_url,
      daysAvailable: days
    });

    const savedKit = await Kit.create({
      userId: req.session.userId,
      ...result.kit
    });

    return res.status(201).json({
      success: true,
      data: {
        kit: savedKit,
        research_status: result.research_status
      }
    });
  } catch (error) {
    next(error);
  }
});


// Update an existing kit
router.put("/:kitId", requireAuth, async (req, res) => {
  try {
    const { kitId } = req.params;

    const {
      source,
      company_brief,
      role,
      questions,
      flashcards,
      schedule,
      coverage
    } = req.body;

    const updatedKit = await Kit.findOneAndUpdate(
      {
        _id: kitId,
        userId: req.session.userId
      },
      {
        $set: {
          ...(source !== undefined && { source }),
          ...(company_brief !== undefined && { company_brief }),
          ...(role !== undefined && { role }),
          ...(questions !== undefined && { questions }),
          ...(flashcards !== undefined && { flashcards }),
          ...(schedule !== undefined && { schedule }),
          ...(coverage !== undefined && { coverage })
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedKit) {
      return res.status(404).json({
        error: {
          message: "Kit not found or you do not have access to it."
        }
      });
    }

    return res.status(200).json({
      kit: updatedKit
    });
  } catch (error) {
    console.error("Update kit error:", error);

    return res.status(500).json({
      error: {
        message: "Failed to update kit."
      }
    });
  }
});

// REGENERATE ONE SECTION
router.post("/:kitId/regenerate", requireAuth, async (req, res, next) => {
  try {
    const { kitId } = req.params;
    const { section } = req.body;

    const allowedSections = [
      "questions",
      "flashcards",
      "schedule"
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_SECTION",
          message:
            "Invalid section. Allowed sections: questions, flashcards, schedule."
        }
      });
    }

    const existingKit = await Kit.findOne({
      _id: kitId,
      userId: req.session.userId
    });

    if (!existingKit) {
      return res.status(404).json({
        success: false,
        error: {
          code: "KIT_NOT_FOUND",
          message: "Kit not found."
        }
      });
    }

    let updateData = {};

    if (section === "questions") {
      const result = await regenerateQuestions({
        role: existingKit.role,
        companyBrief: existingKit.company_brief,
        existingQuestions: existingKit.questions
      });

      updateData = {
        questions: result.questions,
        coverage: result.coverage
      };
    }

    if (section === "flashcards") {
      const flashcards = await regenerateFlashcardSection(
        existingKit.questions
      );

      updateData = {
        flashcards
      };
    }

    if (section === "schedule") {
      const schedule = regenerateScheduleSection({
        daysAvailable: existingKit.schedule?.days_available,
        questions: existingKit.questions,
        requirements: existingKit.role?.requirements || []
      });

      updateData = {
        schedule
      };
    }

    const updatedKit = await Kit.findOneAndUpdate(
      {
        _id: kitId,
        userId: req.session.userId
      },
      {
        $set: updateData
      },
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: `${section} regenerated successfully.`,
      kit: updatedKit
    });
  } catch (error) {
    next(error);
  }
});

export default router;