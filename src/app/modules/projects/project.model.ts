// import { model, Schema } from 'mongoose';
// import { TImage, TProject } from './project.interface';


// const imageSchema = new Schema<TImage>(
//   {
//     url: { type: String, required: true },
//     tag: { type: String, required: true },
//   },
//   { _id: true },
// );


// const projectSchema = new Schema<TProject>(
//   {
//     projectName: { type: String, required: true },
//     mainCategory: { type: Schema.Types.ObjectId,ref:"MainCategory", required: true },
//     category: { type: Schema.Types.ObjectId,ref:"Category", required: true },
//     projectLocation: { type: String, required: true },
//     clientName: { type: String, required: true },
//     year: {
//       type: Number,
//       required: true,
//       min: 1900,
//       max: new Date().getFullYear(),
//     },
//     siteArea: { type: String, required: true },
//     projectDetails: { type: String, required: true },
//     projectImages: { type: [imageSchema] },
//   },
//   { timestamps: true },
// );

// export const Project = model<TProject>('Project', projectSchema);
