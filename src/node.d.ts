declare namespace NodeJS {
    interface Global {
        // if we want to add anything on the node global object
        userStateMap: Map<string, 'BEFORE_QUIZ' | 'INSIDE_QUIZ'>;
        userQuestionMap: Map<string, number>;
        userNumCorrectMap: Map<string, number>;
    }
}
