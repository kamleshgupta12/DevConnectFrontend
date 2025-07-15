export const detectUserEnvironment = async () => {
    // Get Device Info
    const { UAParser } = await import('ua-parser-js');
    const parser = new UAParser();
    const deviceData = parser.getResult();

    // Get Location
    let location = null;
    let address = null;
    let locationError = null;
    
    if ('geolocation' in navigator) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            
            location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            // Reverse Geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`
            );
            const data = await response.json();
            address = data.address;
        } catch (err) {
            locationError = `Location Error: ${err.message}`;
        }
    } else {
        locationError = 'Geolocation not supported.';
    }

    // Get Battery Info
    let battery = null;
    if ('getBattery' in navigator) {
        try {
            const batt = await navigator.getBattery();
            battery = {
                level: Math.round(batt.level * 100),
                charging: batt.charging,
            };
        } catch (err) {
            console.error('Battery info error:', err);
        }
    }

    // Get Network Info
    let network = null;
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        network = {
            type: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
        };
    }

    // Get Webcam Photo
    let photo = null;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photo = canvas.toDataURL('image/jpeg', 0.8);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
    } catch (err) {
        console.error('Webcam error:', err);
    }

    // Screen Info
    const screenInfo = {
        resolution: `${window.screen.width} × ${window.screen.height}`,
        pixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth,
    };

    return {
        device: deviceData,
        location,
        address,
        battery,
        network,
        screen: screenInfo,
        photo,
        timestamp: new Date().toISOString(),
        errors: locationError ? [locationError] : [],
    };
};