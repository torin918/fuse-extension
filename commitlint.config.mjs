/**
 * <type>[<scope>]: <subject>
 *
 * <body>
 *
 * <footer>
 */
export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 100],

        'type-empty': [2, 'never'],
        'type-case': [2, 'always', 'lower-case'],
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'security'],
        ],

        'scope-case': [2, 'always', 'lower-case'],

        'subject-min-length': [2, 'always', 4],
        'subject-max-length': [2, 'always', 100],
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],

        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [2, 'always', 100],

        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [2, 'always', 100],
    },
};
