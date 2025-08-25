const brandModel = require('../Schema/brand'); 

const createBrand = async (req, res) => {
    try {
        const { brandName } = req.body;

        if (!brandName) {
            return res.status(400).json({ error: "Brand name is required" });
        }

        const existingBrand = await brandModel.findOne({ brandName });
        if (existingBrand) {
            return res.status(400).json({ error: "Brand already exists" });
        }

      const newBrand = new brandModel({ brandName });
        await newBrand.save();

        res.status(201).json({
            message: "Brand created successfully",
            brand: newBrand
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBrand = async (req, res) => {
  try {
    const { id, brandName } = req.body;
    const brand = await brandModel.findByIdAndUpdate(id, { brandName }, { new: true });
    res.json(brand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getBrands = async (req, res) => {
  const brands = await brandModel.find();
  res.json(brands);
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await brandModel.findByIdAndDelete(id);
    res.json({ message: "Brand deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
    createBrand,
    updateBrand,
    getBrands,
    deleteBrand
}