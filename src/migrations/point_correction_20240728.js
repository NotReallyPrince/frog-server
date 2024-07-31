const { ObjectId } = require("mongodb");
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://amshen:amshen123@cluster0.tkbajim.mongodb.net";
const LAKH = 100000;

const up = async () => {
  try {
    const client = new MongoClient(uri);
    const db = await client.db("Frog");

    const currentUsers = await db.collection("User").find({}).toArray();
    const currentReferals = await db.collection("Referal").find({}).toArray();

    const points = [];
    for (let i = 0; i < currentUsers?.length; i++) {
      let user = currentUsers[i];
      const point = generatePoints(user, currentReferals, currentUsers);
      points.push(...point);
    }

    const restructureUsers = restructureUsersList(
      currentUsers,
      currentReferals
    );

    // await Promise.all([
    //   db.collection("users").insertMany(restructureUsers),
    //   db.collection("userpoints").insertMany(points),
    // ]);
    console.log("Migration completed Successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error: ", err);
    process.exit(1);
  }
};

up();

const generatePoints = (user, referals, usersList) => {
  const pointsData = [];

  pointsData.push({
    type: "account_age",
    userId: new ObjectId(user._id),
    points: generateAccountAgePoint(Number(user.createdAt)),
  });

  if (user?.isPremium) {
    pointsData.push({
      type: "telegram_premium",
      userId: new ObjectId(user._id),
      points: 1000,
    });
  }
  if (user?.isChannelMember) {
    pointsData.push({
      type: "channel_member",
      userId: new ObjectId(user._id),
      points: 500,
    });
  }
  if (user?.isTwitter) {
    pointsData.push({
      type: "twitter",
      userId: new ObjectId(user._id),
      points: 500,
    });
  }
  if ((user?.userName || "")?.toLowerCase().includes("ape")) {
    pointsData.push({
      type: "ape_in_name",
      userId: new ObjectId(user._id),
      points: 1000,
    });
  }

  for (let i = 0; i < referals?.length; i++) {
    let referalPoint = 0;
    let referal = referals[i];
    if (String(referal.referedById) == String(user?._id)) {
      referalPoint = Number(getReferalPoint(usersList, referal.userId, user));

      if (referalPoint > 0) {
        pointsData.push({
          type: "referral",
          userId: new ObjectId(user._id),
          referred: new ObjectId(referal.userId),
          points: referalPoint,
        });
      }
    }
  }

  return pointsData;
};

const getReferalPoint = (usersList, userId) => {
  const user = usersList?.find((item) => String(item._id) === String(userId));
  return Math.round(generateAccountAgePoint(user?.createdAt) * (20 / 100));
};

const generateAccountAgePoint = (accountAge, totalUsers = 5000) => {
  let boost = 0;
  if (totalUsers < LAKH) {
    boost = 30;
  } else if (totalUsers < LAKH * 5) {
    boost = 20;
  } else if (totalUsers < LAKH * 10) {
    boost = 10;
  }

  let points = accountAge * 365 * 2;

  const addOnPoints = points * (boost / 100);

  points = points + addOnPoints;
  return points;
};

const restructureUsersList = (users, referals) => {
  for (let i = 0; i < users?.length; i++) {
    const user = users[i];
    user.referredBy = getReferedBy(user?._id, referals);
    user.accountAge = user?.createdAt;
    user._id = new ObjectId(user._id);

    delete user.isChannelMember;
    delete user.points;
    delete user.isTwitter;
    delete user.createdAt;
  }
  return users;
};

const getReferedBy = (userId, referals) => {
  for (let i = 0; i < referals?.length; i++) {
    const referal = referals[i];
    if (String(referal?.userId) == String(userId)) {
      return new ObjectId(referal?.referedById);
    }
  }

  return "";
};
