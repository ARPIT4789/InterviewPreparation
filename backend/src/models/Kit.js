import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    kind: {
      type: String,
      enum: ["technical", "behavioural", "domain"],
      required: true
    },
    priority: {
      type: String,
      enum: ["must", "nice"],
      required: true
    }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    requirement_ids: {
      type: [String],
      required: true
    },
   category: {
  type: String,
  enum: [
    "technical",
    "behavioural",
    "domain",
    "system-design",
    "company-fit"
  ],
      required: true
    },
    prompt: {
      type: String,
      required: true
    },
    answer_outline: {
      type: String,
      required: true
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 3,
      required: true
    },

    // Our state-management fields
    source: {
      type: String,
      enum: ["generated", "user"],
      default: "generated"
    },

    edited: {
      type: Boolean,
      default: false
    },

    pinned: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const flashcardSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    front: {
      type: String,
      required: true
    },
    back: {
      type: String,
      required: true
    },
    requirement_ids: {
      type: [String],
      required: true
    }
  },
  { _id: false }
);

const scheduleDaySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true
    },
    focus: {
      type: String,
      required: true
    },
    question_ids: {
      type: [String],
      required: true
    },
    minutes: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const kitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    source: {
      company: String,
      company_url: String,
      role: String,
      location: String,
      jd_chars: Number,
      researched_at: String,
      pages_used: [String]
    },

    company_brief: {
      summary: String,
      what_they_do: String,
      sources: [String]
    },

    role: {
      title: String,
      seniority: String,
      responsibilities: [String],
      requirements: [requirementSchema]
    },

    questions: [questionSchema],

    flashcards: [flashcardSchema],

    schedule: {
      days_available: Number,
      days: [scheduleDaySchema]
    },

    coverage: {
      uncovered_requirement_ids: [String],
      passes: Number
    }
  },
  {
    timestamps: true
  }
);

const Kit = mongoose.model("Kit", kitSchema);

export default Kit;