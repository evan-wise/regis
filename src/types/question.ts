
export type Question = {
    type: 'short-answer';
    text: string;
    answer: string;
} | {
    type: 'multiple-choice';
    text: string;
    options: string[];
    answer: number;
} | {
    type: 'true-false';
    text: string;
    answer: boolean;
}
