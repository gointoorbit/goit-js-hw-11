import axios from 'axios';

export const fetchData = async (searchValue, pageNumber) => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '40029765-d3979f765e8685f4729db0a6b',
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNumber,
        per_page: 40,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
