import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/leetb/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'petfriends';

const uploadImages = async (fileList) => {
  const imageURLs = [];
  const config = {
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  for (const file of fileList) {
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('public_id', file.name);
    const res = await axios({ ...config, data: formData });
    imageURLs.push(res.data.secure_url);
  }

  return new Promise((resolve) => {
    resolve(imageURLs);
  });
};

export default uploadImages;
