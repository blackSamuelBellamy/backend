const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.NAME,
    api_key: process.env.KEY,
    api_secret: process.env.SECRET
})

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto'
}

const nuevaImagen = async (image) => {
    try {
      const result = await cloudinary.uploader.upload(image, opts);
      if (result && result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error("No se pudo cargar la imagen");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

module.exports = nuevaImagen
