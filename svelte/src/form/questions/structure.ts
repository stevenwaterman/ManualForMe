type QuestionTextEndUnderline = {
  startText: string;
  underlineLength: number;
}

type QuestionTextStartUnderline = {
  underlineLength: number;
  endText: string;
}

type QuestionTextMidUnderline = {
  startText: string;
  underlineLength: number;
  endText: string;
}

type UnderlineQuestionText = 
  QuestionTextStartUnderline |
  QuestionTextMidUnderline |
  QuestionTextEndUnderline;

type SliderLabelsOutside = {
  left: string;
  right: string;
}

type SliderLabelsAll = {
  left: string;
  mid: string;
  right: string;
}

type SliderLabels = SliderLabelsOutside | SliderLabelsAll;

type LabelledRangeQuestion = {
  type: "labelledRange";
  questionText: UnderlineQuestionText;
  labels: SliderLabels;
}

type AgreeDisagreeRangeQuestion = {
  type: "agreeRange",
  questionText: string;
}

export type RangeQuestion = {
  answer?: {
    value: -3 | -2 | -1 | 0 | 1 | 2 | 3;
    importance: "low" | "mid" | "high";
    explanation: string;
    hidden: boolean;
  }
} & (LabelledRangeQuestion | AgreeDisagreeRangeQuestion);

export type Question = RangeQuestion;

export type Section = {
  name: string;
  description: string;
  questions: Question[];
}