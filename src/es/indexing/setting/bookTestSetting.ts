export const book_test2_setting = {
  settings: {
    analysis: {
      char_filter: {
        blank_remove_char_filter: {
          type: 'pattern_replace',
          pattern: '\\s',
          replacement: '',
        },
      },
      tokenizer: {
        nori_none: {
          type: 'nori_tokenizer',
          decompound_mode: 'none',
        },
        nori_discard: {
          type: 'nori_tokenizer',
          decompound_mode: 'discard',
        },
        nori_mixed: {
          type: 'nori_tokenizer',
          decompound_mode: 'mixed',
        },
      },
      filter: {
        edgeNGram_24_filter: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 4,
        },
      },
      analyzer: {
        nori_none_analyzer: {
          type: 'custom',
          tokenizer: 'nori_none',
          filter: ['lowercase'],
        },
        nori_discard_analyzer: {
          type: 'custom',
          tokenizer: 'nori_discard',
          filter: ['lowercase'],
        },
        nori_mixed_analyzer: {
          type: 'custom',
          tokenizer: 'nori_mixed',
          filter: ['lowercase'],
        },
        letter_lower_edgeNGram_analyzer: {
          type: 'custom',
          tokenizer: 'letter',
          filter: ['lowercase', 'edgeNGram_24_filter'],
        },
        keyword_lower_edgeNGram_analyzer: {
          type: 'custom',
          tokenizer: 'keyword',
          filter: ['lowercase', 'edgeNGram_24_filter'],
        },
        keyword_lower_blank_edgeNGram_analyzer: {
          type: 'custom',
          char_filter: ['blank_remove_char_filter'],
          tokenizer: 'keyword',
          filter: ['lowercase', 'edgeNGram_24_filter'],
        },
      },
    },
  },
};
