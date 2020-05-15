const { Schema } = mongoose;

const buildItemSchema = new Schema({
  name: String,
  description: String,
  type: String,
  popularity: String,
  programId: String,
  instructionId: String,
  createdAt: String,
  hasProgram:Boolean,
});

module.exports = model('BuildItem', buildItemSchema)