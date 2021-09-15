import { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import GoogleAnalyticsReporter from "components/analytics/GoogleAnalyticsReporter";
import AddressClaimModal from "components/claim/AddressClaimModal";
import Polling from "components/Header/Polling";
import URLWarning from "../components/Header/URLWarning";
import Popups from "../components/Popups";
import Balances from "../pages/Home";
import Web3ReactManager from "components/Web3ReactManager";
import { ApplicationModal } from "state/application/actions";
import { useModalOpen, useToggleModal } from "state/application/hooks";
import DarkModeQueryParamReader from "theme/DarkModeQueryParamReader";
import AddLiquidity from "./AddLiquidity";
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from "./AddLiquidity/redirects";
import Manage from "./Earn/Manage";
import Pool from "./Pool";
import StakeUnstake from "./Stake";
import PoolFinder from "./PoolFinder";
import RemoveLiquidity from "./RemoveLiquidity";
import { RedirectOldRemoveLiquidityPathStructure } from "./RemoveLiquidity/redirects";
import Swap from "./Swap";
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from "./Swap/redirects";
import Farms from "./Farms";
import Farm from "./Farm/Farm";
import WithLayout from "HOC/WithLayout";
import FAQ from "pages/FAQ";
import UserMigrationModule from "./UserMigrate/UserMigrationModule";
import useMigrator from "hooks/useMigrator";

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM);
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM);
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />;
}

export default function App() {
  const { isMigrated, needsMigration } = useMigrator();
  const earnPageComponent = !isMigrated && needsMigration ? UserMigrationModule : WithLayout(Balances);

  return (
    <>
      <Suspense fallback={null}>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        <URLWarning />
        <Popups />
        <Polling />
        <TopLevelModals />
        <Web3ReactManager>
          <>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/faq" component={FAQ} />
              <Route exact strict path="/farms" component={WithLayout(Farms)} />
              <Route path="/farms/:farmId" component={WithLayout(Farm)} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/earn" component={earnPageComponent} />
              <Route exact strict path="/migrate-v1" component={UserMigrationModule} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={WithLayout(PoolFinder)} />
              <Route exact strict path="/pool" component={WithLayout(Pool)} />
              <Route exact strict path="/stake" component={WithLayout(StakeUnstake)} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={WithLayout(AddLiquidity, true)} />
              <Route
                exact
                path="/add/:currencyIdA"
                component={WithLayout(RedirectOldAddLiquidityPathStructure, true)}
              />
              <Route
                exact
                path="/add/:currencyIdA/:currencyIdB"
                component={WithLayout(RedirectDuplicateTokenIds, true)}
              />
              <Route exact path="/create" component={WithLayout(AddLiquidity)} />
              <Route exact path="/create/:currencyIdA" component={WithLayout(RedirectOldAddLiquidityPathStructure)} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={WithLayout(RedirectDuplicateTokenIds)} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={WithLayout(RemoveLiquidity)} />
              <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </>
        </Web3ReactManager>
      </Suspense>
    </>
  );
}
