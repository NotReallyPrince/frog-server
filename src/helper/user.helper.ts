import { PrismaClient, User } from '@prisma/client'
import { generatePointsOnRegister } from '../utils/generatePointsOnRegister';

const prismaService = new PrismaClient()

export type CreateUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  userName?: string;
  premium?: boolean;
  referedBy?: number;
  isPremium?: boolean;
}

const creationDates = [
  { y: 0, m: 0, endId: 100000 },
  { y: 2013, m: 11, startId: 100000 },
  { y: 2013, m: 12, startId: 3000000 },
  { y: 2014, m: 1, startId: 8000000 },
  { y: 2014, m: 2, startId: 13000000 },
  { y: 2014, m: 3, startId: 23000000 },
  { y: 2014, m: 4, startId: 28000000 },
  { y: 2014, m: 5, startId: 33000000 },
  { y: 2014, m: 6, startId: 43000000 },
  { y: 2014, m: 7, startId: 48000000 },
  { y: 2014, m: 8, startId: 58000000 },
  { y: 2014, m: 9, startId: 63000000 },
  { y: 2014, m: 10, startId: 73000000 },
  { y: 2014, m: 11, startId: 78000000 },
  { y: 2014, m: 12, startId: 88000000 },
  { y: 2015, m: 1, startId: 93000000 },
  { y: 2015, m: 2, startId: 103000000 },
  { y: 2015, m: 3, startId: 108000000 },
  { y: 2015, m: 4, startId: 118000000 },
  { y: 2015, m: 5, startId: 123000000 },
  { y: 2015, m: 6, startId: 133000000 },
  { y: 2015, m: 7, startId: 143000000 },
  { y: 2015, m: 8, startId: 148000000 },
  { y: 2015, m: 9, startId: 158000000 },
  { y: 2015, m: 10, startId: 168000000 },
  { y: 2015, m: 11, startId: 178000000 },
  { y: 2015, m: 12, startId: 183000000 },
  { y: 2016, m: 1, startId: 193000000 },
  { y: 2016, m: 2, startId: 203000000 },
  { y: 2016, m: 3, startId: 213000000 },
  { y: 2016, m: 4, startId: 223000000 },
  { y: 2016, m: 5, startId: 233000000 },
  { y: 2016, m: 6, startId: 243000000 },
  { y: 2016, m: 7, startId: 253000000 },
  { y: 2016, m: 8, startId: 263000000 },
  { y: 2016, m: 9, startId: 273000000 },
  { y: 2016, m: 10, startId: 283000000 },
  { y: 2016, m: 11, startId: 293000000 },
  { y: 2016, m: 12, startId: 303000000 },
  { y: 2017, m: 1, startId: 318000000 },
  { y: 2017, m: 2, startId: 328000000 },
  { y: 2017, m: 3, startId: 338000000 },
  { y: 2017, m: 4, startId: 353000000 },
  { y: 2017, m: 5, startId: 363000000 },
  { y: 2017, m: 6, startId: 378000000 },
  { y: 2017, m: 7, startId: 388000000 },
  { y: 2017, m: 8, startId: 403000000 },
  { y: 2017, m: 9, startId: 413000000 },
  { y: 2017, m: 10, startId: 428000000 },
  { y: 2017, m: 11, startId: 443000000 },
  { y: 2017, m: 12, startId: 458000000 },
  { y: 2018, m: 1, startId: 473000000 },
  { y: 2018, m: 2, startId: 488000000 },
  { y: 2018, m: 3, startId: 503000000 },
  { y: 2018, m: 4, startId: 518000000 },
  { y: 2018, m: 5, startId: 538000000 },
  { y: 2018, m: 6, startId: 553000000 },
  { y: 2018, m: 7, startId: 573000000 },
  { y: 2018, m: 8, startId: 593000000 },
  { y: 2018, m: 9, startId: 613000000 },
  { y: 2018, m: 10, startId: 633000000 },
  { y: 2018, m: 11, startId: 653000000 },
  { y: 2018, m: 12, startId: 678000000 },
  { y: 2019, m: 1, startId: 698000000 },
  { y: 2019, m: 2, startId: 723000000 },
  { y: 2019, m: 3, startId: 748000000 },
  { y: 2019, m: 4, startId: 773000000 },
  { y: 2019, m: 5, startId: 798000000 },
  { y: 2019, m: 6, startId: 828000000 },
  { y: 2019, m: 7, startId: 858000000 },
  { y: 2019, m: 8, startId: 888000000 },
  { y: 2019, m: 9, startId: 923000000 },
  { y: 2019, m: 10, startId: 953000000 },
  { y: 2019, m: 11, startId: 1003000000 },
  { y: 2019, m: 12, startId: 1023000000 },
  { y: 2020, m: 1, startId: 1053000000 },
  { y: 2020, m: 2, startId: 1088000000 },
  { y: 2020, m: 3, startId: 1123000000 },
  { y: 2020, m: 4, startId: 1153000000 },
  { y: 2020, m: 5, startId: 1188000000 },
  { y: 2020, m: 6, startId: 1218000000 },
  { y: 2020, m: 7, startId: 1248000000 },
  { y: 2020, m: 8, startId: 1278000000 },
  { y: 2020, m: 9, startId: 1303000000 },
  { y: 2020, m: 10, startId: 1328000000 },
  { y: 2020, m: 11, startId: 1353000000 },
  { y: 2020, m: 12, startId: 1378000000 },
  { y: 2021, m: 1, startId: 1403000000 },
  { y: 2021, m: 2, startId: 1423000000 },
  { y: 2021, m: 3, startId: 1443000000 },
  { y: 2021, m: 4, startId: 1463000000 },
  { y: 2021, m: 5, startId: 1483000000 },
  { y: 2021, m: 6, startId: 1503000000 },
  { y: 2021, m: 7, startId: 1523000000 },
  { y: 2021, m: 8, startId: 1538000000 },
  { y: 2021, m: 9, startId: 1558000000 },
  { y: 2021, m: 10, startId: 1573000000 },
  { y: 2021, m: 11, startId: 1588000000 },
  { y: 2021, m: 12, startId: 1608000000 },
  { y: 2022, m: 1, startId: 1623000000 },
  { y: 2022, m: 2, startId: 1638000000 },
  { y: 2022, m: 3, startId: 1648000000 },
  { y: 2022, m: 4, startId: 1663000000 },
  { y: 2022, m: 5, startId: 1678000000 },
  { y: 2022, m: 6, startId: 1688000000 },
  { y: 2022, m: 7, startId: 1703000000 },
  { y: 2022, m: 8, startId: 1718000000 },
  { y: 2022, m: 9, startId: 1728000000 },
  { y: 2022, m: 10, startId: 1738000000 },
  { y: 2022, m: 11, startId: 1753000000 },
  { y: 2022, m: 12, startId: 1763000000 },
  { y: 2023, m: 1, startId: 1773000000 },
  { y: 2023, m: 2, startId: 1788000000 },
  { y: 2023, m: 3, startId: 1798000000 },
  { y: 2023, m: 4, startId: 1808000000 },
  { y: 2023, m: 5, startId: 1818000000 },
  { y: 2023, m: 6, startId: 1828000000 },
  { y: 2023, m: 7, startId: 1838000000 },
  { y: 2023, m: 8, startId: 1848000000 },
  { y: 2023, m: 9, startId: 1858000000 },
  { y: 2023, m: 10, startId: 1868000000 },
  { y: 2023, m: 11, startId: 1878000000 },
  { y: 2023, m: 12, startId: 1883000000 },
  { y: 2024, m: 1, startId: 1893000000 },
  { y: 2024, m: 2, startId: 1903000000 },
  { y: 2024, m: 3, startId: 1913000000 },
  { y: 2024, m: 4, startId: 1923000000 },
  { y: 2024, m: 5, startId: 1928000000 },
  { y: 2024, m: 6, startId: 1938000000 },
  { y: 2024, m: 7, startId: 1948000000 },
];

function calculateYearsAgo(month, year) {
  if(month == 0 || year == 0) return 1
  // Get the current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-based

  // Calculate the difference in years and months
  let yearsAgo = currentYear - year;
  let monthsAgo = currentMonth - month;

  // Adjust the year difference if the current month is earlier than the given month
  if (monthsAgo < 0) {
      yearsAgo--;
      monthsAgo += 12;
  }

  return yearsAgo + (monthsAgo / 12);
}



export const createUserHelper = async (createUserData: CreateUser):Promise<any> => {
  
  const isUser = await prismaService.user.findFirst({ where: { tgId: createUserData.id } });

  
  if(isUser)
    return getUserDetailsById(isUser.id);
  
  const index = creationDates.findIndex(d => d.startId >= createUserData.id);
  const dateData = creationDates[index];
  const years = calculateYearsAgo(dateData?.m || 0, dateData?.y || 1)


  const user = await prismaService.user.create({
    data: {
      tgId: createUserData.id,
      firstName: createUserData.firstName,
      lastName: createUserData.lastName,
      userName: createUserData.userName,
      isPremium: createUserData?.premium,
      createdAt: Math.round(years)+''
    }
  })

  const userCount:number = await prismaService.user.count()

  let generatedPoints:number = generatePointsOnRegister(Math.round(years), userCount);

  if(createUserData.isPremium)
      generatedPoints += 1000;

  await prismaService.points.create(({
    data: {
      userId: user.id,
      point: generatedPoints
    }
  }))

  if(createUserData.referedBy) {
    const referedUser = await prismaService.user.findFirst(({ where: { tgId: createUserData.referedBy } }))

    if(referedUser)
    await prismaService.referal.create({
      data: {
        referedById: referedUser.id,
        userId: user.id
      }
    })

    // Update the points for the referred user
    await prismaService.points.update({
      where: {
        userId: referedUser.id,
      },
      data: {
        point: {
          increment: Math.round(generatedPoints * (20 / 100)), // Adjust the increment value as needed
        },
      },
    });
  }

  return getUserDetailsById(user.id);
}


export const getUserDetailsById = async (id):Promise<any> => {
  const usersCount:number = await prismaService.user.count();
  const user:any = await prismaService.user.findFirst({ 
    where: { id: id },
    include: {
      point: {
        select: {
          point: true
        }
      }
    }
  })

  const age = generatePointsOnRegister(parseInt(user.createdAt), usersCount)

  const referedBy = await prismaService.referal.findFirst({ 
    where: { userId: user.id },
    include: {
      referedBy: {
        select: {
          firstName: true,
          lastName: true,
          tgId: true,
          userName: true,
        }
      }
    }
  })

  if(referedBy)
    user.referedBy = referedBy.referedBy;
  
  user.age = age;

  return user

}


export const getUserDetailsByTgId = async (id):Promise<any> => {
  const usersCount:number = await prismaService.user.count();
  const user:any = await prismaService.user.findFirst({ 
    where: { tgId: Number(id) },
    include: {
      point: {
        select: {
          point: true
        }
      }
    }
  })

  const age = generatePointsOnRegister(parseInt(user.createdAt), usersCount)

  const referedBy = await prismaService.referal.findFirst({ 
    where: { userId: user.id },
    include: {
      referedBy: {
        select: {
          firstName: true,
          lastName: true,
          tgId: true,
          userName: true,
        }
      }
    }
  })

  user.age = age;

  if(referedBy)
    user.referedBy = referedBy.referedBy;
  

  return user
}

export const getLeadershipBoard = async (page: number, pageSize: number) => {
  // Calculate the number of items to skip
  const skip = (page - 1) * pageSize;

  // Get the total count of users
  const totalCount = await prismaService.user.count();

  // Get paginated, sorted users with selected fields
  const users = await prismaService.user.findMany({
    skip: skip,
    take: pageSize,
    orderBy: {
      point: {
        point: 'desc',
      },
    },
    select: {
      firstName: true,
      lastName: true,
      userName: true,
      tgId:true,
      point: {
        select: {
          point: true,
        },
      },
    },
  });

  return {
    totalCount,
    users,
  };
};

export const myFriendsList = async (tgId:number) => {
  const user = await getUserDetailsByTgId(tgId);
  const userCount:number = await prismaService.user.count()
  const friends = await prismaService.referal.findMany({
    where: { referedById: user.id },
    select: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          tgId: true,
          userName: true,
          createdAt: true,
          point: {
            select: {
              point: true
            }
          }
        }
      }
    }
  })

  const data = friends.map((d) => {
    const tempData = { ...d };

    let generatedPoints: number = generatePointsOnRegister(parseInt(d.user.createdAt), userCount);

    // @ts-ignore
    tempData.user.pointGain = Math.round(generatedPoints * (20 / 100));

    return tempData;
  })

  return { friends, total: friends.length }
}


