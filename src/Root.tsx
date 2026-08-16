import "./index.css";
import { CoffeeCursorShort } from "./CoffeeCursorShort";
import { CoffeeCursorRecap } from "./CoffeeCursorRecap";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <CoffeeCursorShort />
      <CoffeeCursorRecap />
    </>
  );
};
