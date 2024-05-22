export const book_test2_setting = {
  settings: {
    analysis: {
      char_filter: {
        blank_remove_char_filter: {
          type: 'pattern_replace',
          pattern: '\\s',
          replacement: '',
        },
        author_remove_RBracket_char_filter: {
          type: 'pattern_replace',
          pattern: '\\([^\\)]+\\)',
          replacement: '',
        },
        author_remove_SBracket_char_filter: {
          type: 'pattern_replace',
          pattern: '\\[[^\\]]+\\]',
          replacement: '',
        },
        author_remove_etc_char_filter: {
          type: 'pattern_replace',
          pattern:
            '\\b(지음|지은이|저자|그림|만화|사진|일러스트|구성|극본|글|옮김|저|엮음|원작|개작|편역|각색|녹음|편|감수|펴냄|집필|외|역|공역|번역|낭독|by)\\b|\\s*(지음|지은이|저자|그림|만화|사진|일러스트|구성|극본|글|옮김|저|엮음|원작|개작|편역|각색|녹음|편|감수|펴냄|집필|외|역|공역|번역|낭독|by)\\s*',
          replacement: '',
        },
        // author_remove_etc_char_filter: {
        //   type: 'pattern_replace',
        //   pattern:
        //     '\\b(지음|지은이|저자|그림|만화|사진|일러스트|구성|극본|글|옮김|저|엮음|원작|개작|편역|각색|녹음|편|감수|펴냄|집필|외|역|공역|번역|낭독|by)\\b',
        //   replacement: '',
        // },
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
        author_nori_analyzer: {
          type: 'custom',
          char_filter: [
            'author_remove_RBracket_char_filter',
            'author_remove_SBracket_char_filter',
            'author_remove_etc_char_filter',
          ],
          tokenizer: 'nori_mixed',
          filter: ['nori_readingform', 'lowercase'],
        },
        author_standard_analyzer: {
          type: 'custom',
          char_filter: [
            'author_remove_RBracket_char_filter',
            'author_remove_SBracket_char_filter',
            'author_remove_etc_char_filter',
          ],
          tokenizer: 'standard',
          filter: ['nori_readingform', 'lowercase'],
        },
      },
    },
  },
};
