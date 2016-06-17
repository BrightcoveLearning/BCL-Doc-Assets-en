var BCLS_select_code = (function(window, document) {
    var codeBlocks = document.getElementsByClassName('bcls-code'),
        i,
        iMax;

    function selectCode() {
        this.select();
    }

    iMax = codeBlocks.length;
    for (i = 0; i < iMax; i++) {
        codeBlocks[i].addEventListener('click', selectCode);
    }
})(window, document);

var BCLS_expander = (function(window, document) {
    var expanderHeads = document.getElementsByClassName('bcls-expander-head'),
        i,
        iMax;
    iMax = expanderHeads.length;

    function toggleBody() {
        var expanderBody = this.nextElementSibling;
        if (expanderBody.getAttribute('style') === 'height:0;visibility:hidden;display:none;' || expanderBody.getAttribute('style') === null) {
            expanderBody.setAttribute('style', 'height:auto;visibility:visible;display:block;');
            this.setAttribute('class', 'bcls-expander-head changed');
        } else {
            expanderBody.setAttribute('style', 'height:0;visibility:hidden;display:none;');
            this.setAttribute('class', 'bcls-expander-head');
        }
    }

    for (i = 0; i < iMax; i++) {
        expanderHeads[i].addEventListener('click', toggleBody);
    }
})(window, document);

var BCLS_faq = (function (window, document) {
    'use strict';
    var // elements
        questions = document.getElementsByClassName('bcls-question'),
        answers = document.getElementsByClassName('bcls-answer');
    function showAnswer(evt) {
        var answerNumber = parseInt(this.id.substring(1)),
            i = 0,
            iMax = answers.length;
        // hide all answers except the one for the selected question
        for (i = 0; i < iMax; i++) {
            if (i === answerNumber) {
                answers[i].style.display = 'block';
            } else {
                answers[i].style.display = 'none';
            }
        }
    }
    function init() {
        var i = 0, iMax = 0;
        if (questions) {
            iMax = questions.length;
        }

        // add IDs
        for (i = 0; i < iMax; i++) {
            // set ids for answers
            answers[i].setAttribute('id', ('a' + i.toString()));
            // hide all answers initially
            answers[i].setAttribute('style', 'display:none');
            // set ids for questions
            questions[i].setAttribute('id', ('q' + i.toString()));
            // add styling to questions
            questions[i].setAttribute('style', 'margin-top:1em;margin-bottom:1em;');
            // add event listeners
            questions[i].addEventListener('click', showAnswer);
        }
    }
    // call init to kick things off
    init();
})(window, document);
