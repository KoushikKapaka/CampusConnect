import { NextResponse } from "next/server";
import startDb from "../../../../lib/db";
import UserModel from "../../../../models/userModel";

interface NewUserRequest {
  name: string;
  email: string;
  password: string;
}
interface NewUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();
  const oldUser = await UserModel.findOne({ email: body.email });
  if (oldUser)
    return NextResponse.json(
      { error: "email is already in use!" },
      { status: 422 }
    );
  const user = await UserModel.create({ ...body });
  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};
