import React, { useEffect, useState } from 'react';
import './HolidayChecker.css';

function HolidayChecker() {
  const [holidays, setHolidays] = useState([]);
  const [todayHoliday, setTodayHoliday] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState('');
  const monthNames = [
    '', // for all the months
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'];
  const [selectedCountry, setSelectedCountry] = useState('US'); //Default PH

  useEffect(() => {
    const cachedHolidays = localStorage.getItem(`holidays-${selectedCountry}`);

    setHolidays([]);
    setSelectedMonth('');//reset the selected month when country is changes

    //get and fetch holiday data
    if (cachedHolidays) {
      // Use cached data
      setHolidays(JSON.parse(cachedHolidays));
    } else {
      // Fetch new data
      fetch(`https://date.nager.at/api/v3/PublicHolidays/2025/${selectedCountry}`)
      .then(response => response.json())
      .then(data => {
        // Remove duplicate holidays based on the date field
        const uniqueHolidays = Array.from(new Set(data.map(holiday => holiday.date)))
          .map(date => data.find(holiday => holiday.date === date));

        // Sort holidays by date
        const sortedHolidays = uniqueHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
        setHolidays(sortedHolidays);
        localStorage.setItem(`holidays-${selectedCountry}`, JSON.stringify(sortedHolidays));
      })
      .catch(error => console.error('Error fetching holidays:', error));
    }
  }, [selectedCountry]);

  //check if there is holiday today
  useEffect(() => {
    if (holidays.length > 0) {
      const today = new Date().toISOString().split('T')[0]; //get today's date
      const holidayToday = holidays.find(holiday => holiday.date === today);

      if (holidayToday) {
        setTodayHoliday(holidayToday.localName); //set today's holiday name
      } else {
        setTodayHoliday(null); //No Holiday
      }
    }
  }, [holidays]); //run this effect when holidays change

  //date and time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()); //this updates time every second
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //calculate next holiday
  const nextHoliday = holidays.find(holiday => new Date(holiday.date) > new Date());
  const daysUntilNextHoliday = nextHoliday
    ? Math.ceil((new Date(nextHoliday.date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;
  
  const filteredHolidays = holidays.filter(holiday => {
    if (!selectedMonth) return true; // If no month is selected, show all holidays
    return new Date(holiday.date).getMonth() + 1 === parseInt(selectedMonth); // Match the selected month
  });

  return (
    <div className="holiday-tracker">
      <h1>Holiday Tracker</h1>
      <p>Track holidays and special dates</p>
      <div className="tracker-container">
        {/* Left Column */}
        <div className="left-column">
          <div className="card country-card">
            <h2>Select Country</h2>
            <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
              <option value="PH">Philippines</option>
              <option value="US">United States</option>
              <option value="JP">Japan</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="ES">Spain</option>
              <option value="CN">China</option>
            </select>
          </div>
          <div className="card">
            <h2>Today's Holiday</h2>
            {todayHoliday ? (
              <p>{todayHoliday}</p>
            ) : (
              <p>No Holiday Today!</p>
            )}
          </div>
          <div className="card">
            <h2>Current Date and Time</h2>
            <p>{currentTime.toLocaleString()}</p>
          </div>
          <div className="card">
            <h2>Countdown to Next Holiday</h2>
            {nextHoliday ? (
              <p>
                Next Holiday in <strong>{daysUntilNextHoliday} days</strong>
                <br />
                <span className="next-holiday">{nextHoliday.localName}</span>
              </p>
            ) : (
              <p>No upcoming holidays!</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="card">
            <h2>List of Holidays</h2>
            <div className="filter-container">
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                <option value="">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            {filteredHolidays.length === 0 ? (
              <p>No holiday for {selectedMonth ? monthNames[parseInt(selectedMonth)] : 'this month'}!</p>
            ) : (
              <ul>
                {filteredHolidays.map(holiday => (
                  <li key={holiday.date}>
                    <span className="holiday-date">{holiday.date}</span>
                    <span className="holiday-name">{holiday.localName}</span>
                    <span className="holiday-month">{monthNames[new Date(holiday.date).getMonth() + 1]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HolidayChecker;