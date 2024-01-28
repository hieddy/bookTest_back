export const book_test2_mapping = {
  properties: {
    id: {
      type: 'long',
    },
    titleName: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
        },
        nori: {
          type: 'text',
          analyzer: 'nori',
          search_analyzer: 'nori',
        },
        standard: {
          type: 'text',
          analyzer: 'standard',
          search_analyzer: 'standard',
        },
        letter_ENGram: {
          type: 'text',
          analyzer: 'letter_lower_edgeNGram_analyzer',
          search_analyzer: 'letter_lower_edgeNGram_analyzer',
        },
        keyword_ENGram: {
          type: 'text',
          analyzer: 'keyword_lower_edgeNGram_analyzer',
          search_analyzer: 'keyword_lower_edgeNGram_analyzer',
        },
        keyword_lower_blank_edgeNGram: {
          type: 'text',
          analyzer: 'keyword_lower_blank_edgeNGram_analyzer',
          search_analyzer: 'keyword_lower_blank_edgeNGram_analyzer',
        },
      },
    },
    titleChosung: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
        },
        letter_ENGram: {
          type: 'text',
          analyzer: 'letter_lower_edgeNGram_analyzer',
          search_analyzer: 'letter_lower_edgeNGram_analyzer',
        },
        keyword_lower_blank_edgeNGram: {
          type: 'text',
          analyzer: 'keyword_lower_blank_edgeNGram_analyzer',
          search_analyzer: 'keyword_lower_blank_edgeNGram_analyzer',
        },
      },
    },
    authorName: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
        },
        nori: {
          type: 'text',
          analyzer: 'nori',
          search_analyzer: 'nori',
        },
      },
    },
    publisherName: {
      type: 'keyword',
    },
    price: {
      type: 'integer',
    },
    imageUrl: {
      type: 'keyword',
    },
    bookIntroduction: {
      type: 'text',
      analyzer: 'nori',
      search_analyzer: 'nori',
    },
  },
};
