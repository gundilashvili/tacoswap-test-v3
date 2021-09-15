import Button from "components/Button/Button";
import { useState } from "react";
import Modal from "components/Modal";
import PageContent from "./PageContent";
import TransferSuccess from "./TransferSuccess";
import { useWeb3React } from "@web3-react/core";
import { Web3StatusConnect } from "components/Web3Status";
import { useTranslation } from "react-i18next";
import { useWalletModalToggle } from "state/application/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { StyledUserModal, PageTitle, RelativeContent, MainContent, MainContainer } from "./styled";
import useMigrator from "hooks/useMigrator";
import { useIsTransactionPending } from "../../state/transactions/hooks";
import { getDisplayBalance } from "utils/formatBalance";
import BigNumber from "bignumber.js";

function UserMigrationModule() {
  const { allowance, approve, isMigrated, migrate, tacoBalance, swap } = useMigrator();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [isOpenModal, setIsopenModal] = useState(true);
  const toggleWalletModal = useWalletModalToggle();
  const [approveTx, setApproveTx] = useState("");
  const [migrateTx, setMigrateTx] = useState("");
  const isApprovePending = useIsTransactionPending(approveTx);
  const isMigratePending = useIsTransactionPending(migrateTx);

  const pageVariant = {
    initial: {
      opacity: 0,
      x: "100%",
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      x: "-100%",
      opacity: 0,
    },
  };
  const pageTransition = {
    transition: "linear",
    duration: 0.4,
  };

  return (
    <MainContainer>
      <Modal
        isOpen={isOpenModal}
        onDismiss={() => null}
        maxWidth={account ? "592px" : "200px"}
        background="#FFFAF1"
        userMigrationModule
        backgroundModal={account ? "rgba(255, 255, 255, 0.8)" : "transparent"}
        justify="space-between"
        maxHeight="100%"
        radius={account ? "16px" : "31px"}
      >
        {account ? (
          <StyledUserModal>
            <PageTitle>Welcome Back!</PageTitle>
            <AnimatePresence exitBeforeEnter initial={false}>
              <RelativeContent>
                {!isMigrated ? (
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit={{ opacity: 0 }}
                    variants={pageVariant}
                    transition={pageTransition}
                  >
                    <MainContent>
                      <PageContent
                        title="Migrate for TacoChef to eTacoChef"
                        subtitle="TACO token is migrating to eTACO(v2)!"
                        text={[
                          <p key={1}>
                            This migration allows us to properly manage tokenomics of the eTACO(v2) token. Along with
                            the migration, DEX services will be enabled as well.
                          </p>,
                          tacoBalance.gte(0) ? (
                            <p key={2}>
                              During the migration, your{" "}
                              <b>{getDisplayBalance(new BigNumber(tacoBalance.toString()))}</b> TACO tokens will
                              automatically be swapped to eTACO(v2) (1:1).
                            </p>
                          ) : null,
                          <p key={3}>
                            If you have anything staked in TacoSwap, it will automatically be transferred to the new DEX
                            pools (from SushiSwap and UniSwap into TacoSwap).
                          </p>,
                          <p key={4}>
                            You will be able to start earning rewards in eTACO(v2) after the migration, which takes only
                            few minutes.
                          </p>,
                          <p key={5}>
                            If you had any unclaimed rewards on old site, you would need to go to{" "}
                            <a href="https://v1.tacoswap.io" target="_blank" rel="noreferrer">
                              https://v1.tacoswap.io
                            </a>{" "}
                            and Claim rewards there, and then swap TACO to eTACO(v2)
                          </p>,
                        ]}
                      />
                      <Button
                        size="md"
                        width="208px"
                        margin="0 auto 20px"
                        onClick={async () => {
                          setApproveTx((await approve()).hash);
                        }}
                        disabled={isApprovePending || Number(allowance) > 0}
                      >
                        {isApprovePending ? "Approving..." : "Approve TACO"}
                      </Button>
                      <Button
                        size="md"
                        width="208px"
                        margin="10px auto 20px"
                        onClick={async () => {
                          setMigrateTx((await migrate()).hash);
                        }}
                        disabled={isMigratePending || Number(allowance) == 0}
                      >
                        {isMigratePending ? "Migrating..." : "Migrate"}
                      </Button>
                    </MainContent>
                  </motion.div>
                ) : !tacoBalance.eq(0) ? (
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit={{ opacity: 0 }}
                    variants={pageVariant}
                    transition={pageTransition}
                  >
                    <MainContent>
                      <PageContent
                        title="Swap TACO to eTACO(v2)"
                        subtitle=""
                        text={[
                          <p key={1}>
                            You&apos;ve successfully completed the migration process, but seems like you still have{" "}
                            <b>{getDisplayBalance(new BigNumber(tacoBalance.toString()))}</b> TACO to swap to eTACO(v2)
                          </p>,
                        ]}
                      />
                      <Button
                        size="md"
                        width="208px"
                        margin="0 auto 20px"
                        onClick={async () => {
                          setApproveTx((await approve()).hash);
                        }}
                        disabled={isApprovePending || Number(allowance) > 0}
                      >
                        {isApprovePending ? "Approving..." : "Approve TACO"}
                      </Button>
                      <Button
                        size="md"
                        width="208px"
                        margin="10px auto 20px"
                        onClick={async () => {
                          setMigrateTx((await swap()).hash);
                        }}
                        disabled={isMigratePending || Number(allowance) == 0}
                      >
                        {isMigratePending ? "Swapping..." : "Swap"}
                      </Button>
                    </MainContent>
                  </motion.div>
                ) : (
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariant}
                    transition={pageTransition}
                  >
                    <TransferSuccess setIsOpen={setIsopenModal} />
                  </motion.div>
                )}
              </RelativeContent>
            </AnimatePresence>
          </StyledUserModal>
        ) : (
          <Web3StatusConnect width="200px" margin="auto" onClick={toggleWalletModal}>
            {t("Unlock Wallet")}
          </Web3StatusConnect>
        )}
      </Modal>
    </MainContainer>
  );
}

export default UserMigrationModule;
