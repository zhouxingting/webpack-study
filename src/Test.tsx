import styles from "./index.module.less";

import image from "./image/test.jpg";

import { ReactComponent as AdvanceSearch } from "./image/advanceSearch.svg";
import advanceSearch from "./image/advanceSearch.svg";

const Test = () => {
  return (
    <div>
      <div>------svg-Component--------</div>
      <AdvanceSearch />
      <div>------svg-url----------</div>
      <img src={advanceSearch} alt="" />
      <div>------image--------</div>
      <img src={image} alt="" className={styles.image} />
      <div>----------------</div>
      <div className={styles.color}>Test</div>
    </div>
  );
};

export default Test;
