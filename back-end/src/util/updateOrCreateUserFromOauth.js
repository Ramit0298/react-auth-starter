import { getDbConnection } from "../db";

export const updateOrCreateUserFromOauth = async ({ oauthUserInfo }) => {
  const { id: googleId, verified_email: isVerified, email } = oauthUserInfo;
  const db = await getDbConnection("react-auth-db");

  // Check if the user already exists in the database
  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    // Update the existing user's information
    const result = await db.collection("users").findOneAndUpdate(
      { email },
      {
        $set: {
          googleId,
          isVerified,
        },
      },
      { returnDocument: "after" }
    );
    return result.value;
  } else {
    // Create a new user in the database
    const insertResult = await db
      .collection("users")
      .insertOne({ email, googleId, isVerified, info: {} });
    const newUser = await db
      .collection("users")
      .findOne({ _id: insertResult.insertedId });
    return newUser;
  }
};
