document.addEventListener("DOMContentLoaded", function () {
    // Manual adjustments (in minutes) for each prayer
    const adjustments = {
        Fajr: +2,   // Adjust Fajr by adding/subtracting minutes
        Dhuhr: 0,  // Adjust Dhuhr by adding/subtracting minutes
        //Asr: 0,    // Adjust Asr by adding/subtracting minutes
        Maghrib: 16,// Adjust Maghrib by adding/subtracting minutes
        //Isha: 0    // Adjust Isha by adding/subtracting minutes
    };

    // Manual adjustment for Hijri date in days
    const hijriDateAdjustment = -1; // Number of days to adjust the Hijri date

    // Function to adjust the prayer time and convert to 12-hour format with AM/PM
    const adjustTime = (time, adjustment) => {
        let [hours, minutes] = time.split(':').map(Number);
        let date = new Date();
        date.setHours(hours, minutes);
        date.setMinutes(date.getMinutes() + adjustment);
        
        let adjustedHours = date.getHours();
        let adjustedMinutes = String(date.getMinutes()).padStart(2, '0');
        let period = adjustedHours >= 12 ? 'م' : 'ص';

        adjustedHours = adjustedHours % 12 || 12; // Convert to 12-hour format
        adjustedHours = String(adjustedHours).padStart(2, '0');

        return `${adjustedHours}:${adjustedMinutes} ${period}`;
    };

    // Function to update the current time
    const updateCurrentTime = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
        let period = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12; // Convert to 12-hour format
        hours = String(hours).padStart(2, '0');

        const currentTime = `${hours}:${minutes}:${seconds} ${period}`;
        document.getElementById("current-time").textContent = currentTime;

        // Display the day of the week
        const dayOfWeek = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(now);
        document.getElementById("current-day").textContent = dayOfWeek;
    };

    // Function to update the Hijri date with manual adjustment
    const updateHijriDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + hijriDateAdjustment); // Apply the Hijri date adjustment
        const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(today);

        document.getElementById("hijri-date").textContent = hijriDate;
    };

    // Fetch prayer times for Dammam
    const fetchPrayerTimes = async () => {
        try {
            const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Dammam&country=Saudi%20Arabia&method=4');
            const data = await response.json();
            const timings = data.data.timings;

            document.getElementById("fajr").textContent = adjustTime(timings.Fajr, adjustments.Fajr);
            document.getElementById("dhuhr").textContent = adjustTime(timings.Dhuhr, adjustments.Dhuhr);
           // document.getElementById("asr").textContent = adjustTime(timings.Asr, adjustments.Asr);
            document.getElementById("maghrib").textContent = adjustTime(timings.Maghrib, adjustments.Maghrib);
           // document.getElementById("isha").textContent = adjustTime(timings.Isha, adjustments.Isha);
        } catch (error) {
            console.error("Error fetching prayer times:", error);
        }
    };

    // Update the current time every second
    setInterval(updateCurrentTime, 1000);

    // Update Hijri date
    updateHijriDate();

    fetchPrayerTimes();
});
