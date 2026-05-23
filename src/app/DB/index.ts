import config from '../config';
import { User } from '../modules/user/user.model';



export const seedAdmin = async () => {
  const isAdminExist = await User.findOne({
    email: config.admin_email,
    role: 'admin',
  });

  if (isAdminExist) {
    console.log('⚠️ Admin already exists.');
  } else {
    await User.create(adminData);
    console.log('✅ Admin seeded successfully!');
  }
};

const adminData = {
  name: 'Admin',
  email: config.admin_email,
  password: config.admin_password,
  role: 'admin',
};
