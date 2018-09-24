import React from 'react'
import { Image } from 'react-native'

const Thumbnail = (props) => {
    return (
        <Image
            //source={{uri: 'file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540infotrak%252Flogin-app/tracktreads/1172018_162638.jpg'}}
            source={{uri: props.uri}}
            style={{width: 200, height: 200}}
        />
    )
}


export { Thumbnail };
