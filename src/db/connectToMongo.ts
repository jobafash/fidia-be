import mongoose, { ConnectOptions } from 'mongoose';
const { MONGO_URL } = process.env;

export default async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('DB connected successfully');
  } catch (err) {
    console.log(err);
    console.log('DB connection not successful');
  }
};