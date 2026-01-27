import datetime
import pandas as pd
from sklearn.linear_model import LinearRegression

weightCheckins = [
    ("2025-01-01", 84.7),
    ("2025-01-08", 84.2),
    ("2025-01-15", 83.7),
    ("2025-01-22", 82.5),
] # Array containing tuples which contain data regarding weight and date of checkins for user
#! HARDCODED FOR THE MOMENT, WILL BECOME A JSON FROM API REQUESTS FURTHER INTO DEVELOPMENT

goalWeight = 75
goalDateStr = "2025-08-12"
def predictWeightAndGoals(weightCheckins, goalWeight, goalDateStr):
    df = pd.DataFrame(weightCheckins, columns=["Date", "Weight"])
    df["Date"] = pd.to_datetime(df["Date"])
    df["DaysSinceStart"] = (df["Date"] - df["Date"].iloc[0]).dt.days # Iloc[0] returns the FIRST date in the data col
    # .dt.days converts each "TimeDetla" into a plain integer rerpesenting number of days since first weigh in

    x = df[["DaysSinceStart"]].values # creates a 2D array containing number of days
    y = df["Weight"].values

    model = LinearRegression()
    model.fit(x, y)

    goalDate = pd.to_datetime(goalDateStr)
    goalDay = (goalDate - df["Date"].iloc[0]).days

    predictedWeight = model.predict([[goalDay]])[0]
    currentWeight = df["Weight"].iloc[-1]

    if goalWeight - currentWeight < 0:
        direction = "cutting"
    else:
        direction = "bulking"

    if direction == "cutting":
        if predictedWeight <= goalWeight:
            status = "On Track to goal weight"
        elif predictedWeight <= goalWeight + 2:
            status = "Close to being on track to your goal"
        else:
            status = "Unlikely you will meet your goal at this rate."
    else:
        if predictedWeight >= goalWeight:
            status = "On Track to goal weight"
        elif predictedWeight >= goalWeight - 2:
            status = "Close to being on track to your goal"
        else:
            status = "Unlikely you will meet your goal at this rate."

    firstCheckInDate = df["Date"].iloc[0]

    m = model.coef_[0] # Model being the model defined above, coef being an 
    #attribute of the model that stores slopes of the line it learned from the dataset
    #Basically just getting the average value of how much each user is losing or gaining overtime each day
    b = model.intercept_ # Intercept is another attribute which is the weight of the user on their first checkin

    daysToGoal = (goalWeight - b) / m
    predictedGoalDate = firstCheckInDate + datetime.timedelta(days=daysToGoal)
    formattedDate = predictedGoalDate.strftime("%b %d, %Y")

    print("Weight Goal Predictions:")
    print(f"Goal Weight: {goalWeight}kg")
    print(f"Current Weight: {currentWeight}kg")
    print(f"Predicted Weight by goal date: {predictedWeight:.2f}kg")
    print(f"Status: {status}")
    print(f"By our (Rough) estimates you will meet your goal weight by {formattedDate}")

predictWeightAndGoals(weightCheckins, goalWeight, goalDateStr)