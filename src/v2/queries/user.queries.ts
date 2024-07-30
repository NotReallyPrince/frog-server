import mongoose from "mongoose";
import { PointsModel } from "../../models/points.model"
import { UserModel } from "../../models/user.model";


export const getTopUsersWithPoints = async () => {
    try {
      const topUsers = await PointsModel.aggregate([
        {
            $group: {
                _id: "$userId",
                totalPoints: {
                  $sum: "$points"
                },
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
            totalPoints: 1,
            pointsDetails: 1,
            firstName: '$userDetails.firstName'

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

///CURRENTLY NOT USING BUT KEEPING FOR FUTURE THIS FUNCTION RETURNS THE USERS RANK,POINT,NAME
  export const getCurrentUserPointsRank = async (userId) => {
    try {
      // Ensure userId is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
  
      // Convert userId to ObjectId
      const objectId = new mongoose.Types.ObjectId(userId);
  
      // Aggregate to sum points and find the current user's points
      const [userPoints, rankData] = await Promise.all([
        PointsModel.aggregate([
          { $match: { userId: objectId } },
          { $group: { _id: "$userId", totalPoints: { $sum: { $toDouble: "$points" } } } }
        ]),
        PointsModel.aggregate([
          { $group: { _id: "$userId", totalPoints: { $sum: { $toDouble: "$points" } } } },
          { $sort: { totalPoints: -1 } },
          { $project: { _id: 0, userId: "$_id", totalPoints: 1 } }
        ])
      ]);

      const userTotalPoints = userPoints.length > 0 ? userPoints[0]?.totalPoints : 0;

      // Access the ranks from the aggregation result
      const ranks = rankData.map(r => ({
        userId: r.userId.toString(),
        totalPoints: r.totalPoints
      }));
  
      // Find the user's rank
      const userRank = ranks.findIndex(r => r.userId === objectId.toString()) + 1 || null;
  
      // Get user details
      const user = await UserModel.findById(objectId, { firstName: 1 });
  
      return {
        position: userRank,
        userId: userId,
        points: userTotalPoints,
        name: user ? user.firstName : null
      };
    } catch (error) {
      console.error('Error retrieving user rank:', error);
      throw error;
    }
  };


  export const getTopUsersWithSpecificUserRank = async (specificUserId) => {
    try {
      // Ensure specificUserId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(specificUserId)) {
        throw new Error('Invalid specificUserId');
      }
  
      // Convert specificUserId to ObjectId
      const objectId = new mongoose.Types.ObjectId(specificUserId);
  
      // Aggregate to get top users
      const topUsers = await PointsModel.aggregate([
        {
          $group: {
            _id: "$userId",
            totalPoints: { $sum: { $toDouble: "$points" } } // Convert points to double and sum
          }
        },
        {
          $sort: { totalPoints: -1 } // Sort users by total points descending
        },
        {
          $limit: 100 // Limit to top 100 users
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        { $unwind: "$userDetails" },
        {
          $project: {
            _id: 0,
            totalPoints: 1,
            firstName: "$userDetails.firstName"
          }
        }
      ]);
  
      // Separate query to find the rank of the specific user
      const specificUserRank = await PointsModel.aggregate([
        {
          $group: {
            _id: "$userId",
            totalPoints: { $sum: { $toDouble: "$points" } }
          }
        },
        {
          $sort: { totalPoints: -1 }
        },
        {
          $group: {
            _id: null,
            users: { $push: { userId: "$_id", totalPoints: "$totalPoints" } }
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
            "users.userId": objectId
          }
        },
        {
          $project: {
            _id: 0,
            totalPoints: "$users.totalPoints",
            rank: { $add: ["$rank", 1] }
          }
        }
      ]);
  
      // Extract specific user's rank
      const specificUser = specificUserRank[0] || { userId: specificUserId, totalPoints: 0, rank: null };
  
      return {
        topUsers,
        specificUser
      };
    } catch (error) {
      console.error("Error fetching top users with specific user rank: ", error);
      throw error;
    }
  };
  
  
export const getFriendsDetails = async (userId) => {
  try{
    console.log(userId);
    
    const user = await UserModel.findOne({tgId: userId})
    
    const friends = await PointsModel.aggregate([
      {
        $match: {
          userId: user._id,
          type: 'referral'
        }
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'referred',
          as: 'friend'
        }
      },
      {
        $unwind: "$friend"
      },
      {
        $project: {
          firstName: "$friend.firstName",
          points: 1
        }
      }
    ])
    
    return friends;
  }catch(error){
    return false
  }
}