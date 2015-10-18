# Tock Reporter

Using the API from [Tock](https://github.com/18f/tock), get a CSV with utilization rates for employees.

## Installation

```
git clone https://github.com/vzvenyach/tock-reporter.git
mv employees.json.sample employees.json
```

## Usage

First, you'll need to get the OAUTHPROXY cookie and create an environmental variable. Then, it's as easy as: 

`npm start [date]`

## Sample Results

```
name,utilization_rate
vladlen.zvenyach, 100
```

^^ Yeah, I wish!