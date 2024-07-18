const LAKH:number = 100000

export const generatePointsOnRegister = (accountAge: number, totalUsers:number): number => {
    let boost = 0;
    if(totalUsers < LAKH){
        boost = 30;
    }else if(totalUsers < LAKH * 5){
        boost = 20
    }else if(totalUsers < LAKH * 10){
        boost = 10;
    }

    let points = accountAge * 365 * 2

    const addOnPoints =  points * (boost/100)

    

    points = points + addOnPoints
    return points
}