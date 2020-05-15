const { Schema } = mongoose;

const instructionSchema = new Schema({
  name: String,
  type: String,
  fileName: String,
});

module.exports = model('Instruction', instructionSchema)
