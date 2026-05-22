import config from '../config';
import { User } from '../modules/users/user.model';



export const seedSuperAdmin = async () => {
  const isSuperAdminIsExist = await User.findOne({
    email: 'admin@email.com',
    role: 'superAdmin',
  });
  if (isSuperAdminIsExist) {
    console.log('⚠️ super admin already exists. Skipping seeding.');
  } else {
    await User.create(superAdminData);
    console.log('✅ super admin seeded successfully!');
  }
};

const superAdminData = {
  name: 'MD. SHAHIN MIAH',
  email: `${config.super_admin_email}`,
  password: `${config.super_admin_password}`,
  imageUrl: 'https://softypy.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fshahin.6e146ab3.jpeg&w=1920&q=75',
  role: 'superAdmin',
};
