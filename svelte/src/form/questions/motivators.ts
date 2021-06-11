import type { Question, Section } from "./structure";

const computerVsPeople: Question = {
  type: "labelledRange",
  questionText: {
    startText: "I'm most motivated by",
    underlineLength: 7,
    endText: "problems"
  },
  labels: {
    left: "Computer",
    right: "People"
  }
}

const makeDifference: Question = {
  type: "agreeRange",
  questionText: "My work needs to make a difference in the world"
}

const ethics: Question = {
  type: "agreeRange",
  questionText: "I couldn't work on a project that I thought was unethical"
}

const velocity: Question = {
  type: "labelledRange",
  questionText: {
    startText: "My ideal project would move",
    underlineLength: 12
  },
  labels: {
    left: "Slow & steady",
    right: "Fast & break things"
  }
}

export const roleDomain: Section = {
  name: "Role Domain",
  description: "What kind of work motivates you the most?",
  questions: [
    computerVsPeople,
    makeDifference,
    ethics,
    velocity
  ]
}


const interestRequired: Question = {
  type: "agreeRange",
  questionText: "I can't work on a project that doesn't interest me"
}

const lateVsBroken: Question = {
  type: "labelledRange",
  questionText: {
    startText: "I'd rather release a product",
    underlineLength: 12
  },
  labels: {
    left: "Very late",
    right: "Full of bugs"
  }
}

const variety: Question = {
  type: "agreeRange",
  questionText: "I'd be happy if every day was the same"
}

const bigVsSmall: Question = {
  type: "labelledRange",
  questionText: {
    startText: "I'd rather add",
    underlineLength: 10
  },
  labels: {
    left: "One big feature",
    right: "Many small features"
  }
}

const prototypeVsProduction: Question = {
  type: "labelledRange",
  questionText: {
    startText: "I'd rather work on",
    underlineLength: 8,
    endText: "software"
  },
  labels: {
    left: "Prototype",
    right: "Production"
  }
}

const success: Question = {
  type: "labelledRange",
  questionText: {
    startText: "A project's success is measured by what we",
    underlineLength: 6
  },
  labels: {
    left: "learn",
    right: "deliver"
  }
}

const users: Question = {
  type: "agreeRange",
  questionText: "Users generally know the main problems with a product"
}

const exploration: Question = {
  type: "labelledRange",
  questionText: {
    startText: "I'm happiest when a project has",
    underlineLength: 15
  },
  labels: {
    left: "Clear vision & Direction",
    right: "Limitless possibilities"
  }
}

const results: Question = {
  type: "agreeRange",
  questionText: "I get fed up working on a task if we don't see the results for a long time"
}

export const intrinsicExtrinsic: Section = {
  name: "Intrinsic vs Extrinsic",
  description: "Are you motivated by internal factors or external factors?",
  questions: [
    interestRequired,
    lateVsBroken,
    variety,
    bigVsSmall,
    prototypeVsProduction,
    success,
    users,
    exploration,
    results
  ]
}