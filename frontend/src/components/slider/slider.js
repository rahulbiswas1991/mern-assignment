import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


export default function SliderBar({ setValue }) {
    const [value1, setValue1] = React.useState([20, 37]);
    const minDistance = 10;
    React.useEffect(() => {
        setValue(value1);
    }, [value1])
    const handleChange1 = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
        } else {
            setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
        }
    };

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                getAriaLabel={() => 'Minimum distance'}
                value={value1}
                max={1000}
                onChange={handleChange1}
                valueLabelDisplay="auto"
                disableSwap
            />
        </Box>
    );
}
