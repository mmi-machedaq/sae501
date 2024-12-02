module.exports = {
  rules: {
    'custom-commit-message-rule': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'custom-commit-message-rule': ({ raw }) => {
          const regex =
            /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci): \{.+\} .+$/;

          return [
            regex.test(raw.trim()),
            `Commit message must follow the format => "type: {context} message"`,
          ];
        },
      },
    },
  ],
};
