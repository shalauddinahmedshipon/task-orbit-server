// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { StatusCodes } from 'http-status-codes';
// import AppError from '../../error/AppError';
// import { TProject } from './project.interface';
// import { Project } from './project.model';
// import QueryBuilder from '../../builders/QueryBuilders';
// import { projectSearchableFields } from './project.constant';
// import { Category } from '../category/category.model';
// import { MainCategory } from '../mainCategory/mainCategory.model';


// const createProjectIntoDB = async (payload: TProject) => {
//   const isProjectIsExist = await Project.findOne({
//     projectName: payload?.projectName,
//   });
//   if (isProjectIsExist) {
//     throw new AppError(StatusCodes.CONFLICT, 'The Project is already exist!');
//   }
//   const isMainCategoryExist= await MainCategory.findById(payload.mainCategory);
//   if (!isMainCategoryExist) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'The main category does not exist!');
//   }
//   const isCategoryExist= await Category.findById(payload.category);
//   if (!isCategoryExist) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'The category does not exist!');
//   }
//   const result = await Project.create(payload);
//   return result;
// };


// const getAllProjectsFromDB = async (query: Record<string, unknown>) => {
//   const projectQueryBuilder = new QueryBuilder(Project.find().populate('mainCategory').populate('category'), query)
//     .search(projectSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const data = await projectQueryBuilder.modelQuery;
//   const meta = await projectQueryBuilder.countTotal();
//   return { data, meta };
// };

// // search project 
// const searchProjectsFromD=async(query:string)=>{
// const results = await Project.aggregate([
// {
//   $lookup:{
//     from:"maincategories",
//     localField:"mainCategory",
//     foreignField:"_id",
//     as:"mainCategoryDetails"
//   }
// },
// {
//   $unwind:"$mainCategoryDetails"
// },
// {
//   $lookup:{
//     from:"categories",
//     localField:"category",
//     foreignField:"_id",
//     as:"categoryDetails"
//   }
// },
// {
//   $unwind:"$categoryDetails"
// },

// {
//   $match:{
//     $or:[
//       {projectName:{$regex:query,$options:"i"}},
//       {projectLocation:{$regex:query,$options:"i"}},
//       {"mainCategoryDetails.name":{$regex:query,$options:"i"}},
//       {"categoryDetails.name":{$regex:query,$options:"i"}},
//     ]
//   }
// },

// {
//   $project:{
//     projectName:1,
//     projectLocation:1,
//     "mainCategoryDetails.name":1,
//     "categoryDetails.name":1,
//     projectImages:1
//   }
// }
// ])

// return results
// }

// const getSingleProjectFromDB = async (projectId: string) => {
//   const result = await Project.findById(projectId).populate('category').populate('mainCategory');
//   if (!result) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'The project is not exist!');
//   }
//   return result;
// };


// const updateProjectIntoDB = async (projectId: string, payload: any) => {
//   const { updateImages, newImages, deleteImageIds, updatedFields } = payload;
  
//   if (updatedFields && Object.keys(updatedFields).length > 0) {
//     if(updatedFields.category||updatedFields.mainCategory){
//       if(!(updatedFields.mainCategory&&updatedFields.category)){
//         throw new AppError(StatusCodes.BAD_REQUEST,"Main category and category both are required!")
//       }
//       const isCategoryAndMainCategoryIsExist=await Category.findOne({_id:updatedFields.category,mainCategory:updatedFields.mainCategory});
//       if(!isCategoryAndMainCategoryIsExist){
//         throw new AppError(StatusCodes.BAD_REQUEST,"Main category and category  do not exist! or category does not exist in the main category")
//       }
//     }
//     await Project.findByIdAndUpdate(
//       projectId,
//       { $set: updatedFields },
//       { new: true },
//     );
//   }
//   if (newImages && newImages.length > 0) {
//     await Project.findByIdAndUpdate(
//       projectId,
//       { $push: { projectImages: { $each: newImages } } },
//       { new: true },
//     );
//   }

//   if (deleteImageIds && deleteImageIds.length > 0) {
//     await Project.findByIdAndUpdate(
//       projectId,
//       { $pull: { projectImages: { _id: { $in: deleteImageIds } } } },
//       { new: true },
//     );
//   }

//   if (updateImages && updateImages.length > 0) {
//     for (const image of updateImages) {
//       await Project.findOneAndUpdate(
//         { _id: projectId, 'projectImages._id': image.imageId },
//         {
//           $set: {
//             'projectImages.$.url': image.url,
//             'projectImages.$.tag': image.tag,
//           },
//         },
//         { new: true },
//       );
//     }
//   }

// const isProjectIsExist = await Project.findById(projectId);
//   if (!isProjectIsExist){
//     throw new AppError(StatusCodes.NOT_FOUND, 'The project is not exist!');
//   }
//   return isProjectIsExist;
// };

// const deleteProjectFromDB = async (projectId: string) => {
//   const isProjectIsExist = await Project.findById(projectId);
//   if (!isProjectIsExist) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'The project is not exist!');
//   }
//   const result = await Project.findByIdAndDelete(projectId);
//   return result;
// };


// export const projectService = {
//   createProjectIntoDB,
//   getAllProjectsFromDB,
//   getSingleProjectFromDB,
//   searchProjectsFromD,
//   updateProjectIntoDB,
//   deleteProjectFromDB,
// };
