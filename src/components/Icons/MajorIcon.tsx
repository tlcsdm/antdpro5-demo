import Icon from '@ant-design/icons';
import React from 'react';

const MajorIcon = (props: any) => {
  const HeartSvg = () => (
    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="12220" width="16" height="16">
      <path
        d="M918 787.978L535.4 923.26l-9.98 4.74h-30.84l-9.98-4.74L102 787.978 78 754.03V231.948L126 198l40 14.144V134.57L217.42 102 510 240.85 802.58 102 854 134.57v77.574L894 198l48 33.948V754.03zM150 282.866V728.57l16 5.658V288.524z m324 20.67l-236-112v534.93l236 112v-534.93z m308 422.93V191.538l-236 112v534.926m324-555.6l-16 5.658v445.706l16-5.658V282.866z m-132 115.4L594.916 466l-0.916-1.932v-77.39l144-68.164v79.752z m0 161L594.916 627l-0.916-1.932v-77.39l144-68.164v79.752z m-314-95.54l-0.916 1.93L280 397.852v-79.838l144 68.236v77.474z m0 161.17l-0.916 1.932L280 559.022v-79.836l144 68.236v77.472z"
        p-id="12221"></path>
    </svg>
  );

  return (
    <Icon component={HeartSvg} {...props} />
  );
};

export default MajorIcon;
