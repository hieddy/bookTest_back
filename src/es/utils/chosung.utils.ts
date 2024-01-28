export const separateChosung = (str) => {
  const cho = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];

  let result = '';

  for (let i = 0; i < str?.length; i++) {
    const charCode = str.charCodeAt(i);

    if (charCode >= 44032 && charCode <= 55203) {
      // 한글 범위
      const index = Math.floor((charCode - 44032) / 588);
      result += cho[index];
    } else {
      result += str[i];
    }
  }

  return result;
};
