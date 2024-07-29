import { PointsModel } from "../../models/points.model"


export const getTopUsersWithPoints = async () => {
    try {
      const topUsers = await PointsModel.aggregate([
        {
            $group: {
                _id: "$userId",
                totalPoints: {
                  $sum: "$points"
                },
                pointsDetails: {
                    $push: {
                      type: "$type",
                      point: "$points"
                    }
                  }
            }
        },
        {
          $sort: { totalPoints: -1 }
        },
        {
          $limit: 100
        },
        {
          $lookup: {
            from: 'users', // The name of the user collection
            localField: '_id',
            foreignField: '_id', // Assuming tgId is the field that matches userId in Points
            as: 'userDetails'
          }
        },
        {
          $unwind: "$userDetails"
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            totalPoints: 1,
            pointsDetails: 1,
            'userDetails.firstName': 1,
            'userDetails.lastName': 1,
            'userDetails.userName': 1
          }
        }
      ]);
      
      return topUsers;
    } catch (error) {
      console.error("Error fetching top users with points: ", error);
    }
  };

  export const getSpecificUserPoints = async (specificUserId) => {
    try{
        const specificUserRank = await PointsModel.aggregate([
            {
              $group: {
                _id: "$userId",
                totalPoints: { $sum: "$points" }
              }
            },
            {
              $sort: { totalPoints: -1 }
            },
            {
              $group: {
                _id: null,
                users: {
                  $push: {
                    userId: "$_id",
                    totalPoints: "$totalPoints"
                  }
                }
              }
            },
            {
              $unwind: {
                path: "$users",
                includeArrayIndex: "rank"
              }
            },
            {
              $match: {
                "users.userId": specificUserId
              }
            },
            {
              $project: {
                _id: 0,
                userId: "$users.userId",
                totalPoints: "$users.totalPoints",
                rank: { $add: ["$rank", 1] } // Rank is 0-based, so add 1
              }
            }
          ]);
      
          // Aggregate the points and user details for the specific user
          const specificUserDetails = await PointsModel.aggregate([
            {
              $match: { userId: specificUserId }
            },
            {
              $group: {
                _id: "$userId",
                totalPoints: { $sum: "$points" },
                pointsDetails: {
                  $push: {
                    type: "$type",
                    point: "$point"
                  }
                }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
              }
            },
            {
              $unwind: "$userDetails"
            },
            {
              $project: {
                _id: 0,
                userId: "$_id",
                totalPoints: 1,
                pointsDetails: 1,
                userDetails: 1
              }
            }
          ]);

          return {
            ...specificUserDetails[0],
            rank: specificUserRank[0]?.rank || null 
          }
    }catch(err){
        return false
    }
  }