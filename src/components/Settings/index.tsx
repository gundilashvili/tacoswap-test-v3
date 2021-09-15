import { useRef, useState } from "react";
import { X } from "react-feather";
import { ReactComponent as OpenSettings } from "assets/svg/OpenSetting.svg";
import { ReactComponent as CloseSettings } from "assets/svg/CloseSetting.svg";
import { Text } from "rebass";
import styled from "styled-components";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { ApplicationModal } from "../../state/application/actions";
import { useModalOpen, useToggleSettingsMenu } from "../../state/application/hooks";
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
} from "../../state/user/hooks";
import { TYPE } from "../../theme";
import { ButtonError } from "../Button";
import { AutoColumn } from "../Column";
import Modal from "../Modal";
import QuestionHelper from "../QuestionHelper";
import { RowBetween, RowFixed } from "../Row";
import Toggle from "../Toggle";
import TransactionSettings from "../TransactionSettings";
import { motion, AnimatePresence } from "framer-motion";

const StyledText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.brown1};
  @media (max-width: 420px) {
    font-size: 14px;
  }
`;

const StyledTYPE = styled(TYPE.black)`
  color: ${({ theme }) => theme.brownOpacity};
  font-size: 14px;
  @media (max-width: 420px) {
    font-size: 12px;
  }
`;

const StyledMenuIcon = styled(CloseSettings)`
  height: 25px;
  width: 25px;

  :hover {
    opacity: 0.7;
  }

  @media (max-width: 420px) {
    height: 12px;
    width: 12px;
  }
`;

const StyledOpenMenuIcon = styled(OpenSettings)`
  height: 25px;
  width: 25px;
  :hover {
    opacity: 0.7;
  }
  @media (max-width: 420px) {
    height: 12px;
    width: 12px;
  }
`;

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.brown1};
  }
`;

const StyledMenuButton = styled.button`
  position: relative;
  width: 41px;
  height: 41px;
  border: none;
  margin: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 22px;
  background-color: #fff;
  padding: 8px;

  border-radius: 17px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`;
const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`;

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  text-align: left;
`;

const MenuFlyout = styled.span`
  min-width: 20.125rem;
  background-color: transparents;
  border-radius: 16px;
  color: ${({ theme }) => theme.brown1};
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 111px;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  left: 20px;
  transition: transform 0.5s ease;
  .active {
    transform: scale(1);
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
  `};
  @media (max-width: 420px) {
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 4rem;
    border-radius: 0;
  }
`;

const ModalContentWrapper = styled.div`
  background-color: #fff;
  border-radius: 20px;
  color: #614e56;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>();
  const open = useModalOpen(ApplicationModal.SETTINGS);
  const toggle = useToggleSettingsMenu();

  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance();

  const [ttl, setTtl] = useUserTransactionTTL();

  const [expertMode, toggleExpertMode] = useExpertModeManager();

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly();

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false);

  useOnClickOutside(node, open ? toggle : undefined);

  const pageVariant = {
    out: {
      opacity: 0,
      y: "-15%",
    },
    in: {
      opacity: 1,
      y: 0,
    },
  };
  const pageTransition = {
    transition: "linear",
    duration: 0.5,
    height: 0,
  };

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      {showConfirmation ? (
        <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight="100vh">
          <ModalContentWrapper>
            <AutoColumn gap="lg">
              <RowBetween style={{ padding: "0 2rem" }}>
                <div />
                <Text fontWeight={500} fontSize={20}>
                  Are you sure?
                </Text>
                <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
              </RowBetween>
              <AutoColumn gap="lg" style={{ padding: "0 2rem" }}>
                <Text fontWeight={500} fontSize={20}>
                  Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                  in bad rates and lost funds.
                </Text>
                <Text fontWeight={600} fontSize={20}>
                  ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
                </Text>
                <ButtonError
                  error={true}
                  padding={"12px"}
                  onClick={() => {
                    if (window.prompt('Please type the word "confirm" to enable expert mode.') === "confirm") {
                      toggleExpertMode();
                      setShowConfirmation(false);
                    }
                  }}
                >
                  <Text fontSize={20} fontWeight={500} color={"#614E56"} id="confirm-expert-mode">
                    Turn On Expert Mode
                  </Text>
                </ButtonError>
              </AutoColumn>
            </AutoColumn>
          </ModalContentWrapper>
        </Modal>
      ) : null}
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        {!open ? <StyledMenuIcon /> : <StyledOpenMenuIcon />}
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </StyledMenuButton>
      <AnimatePresence>
        {open ? (
          <MenuFlyout className={open && "active"}>
            <motion.div initial="out" animate="in" exit="out" variants={pageVariant} transition={pageTransition}>
              <div style={{ backgroundColor: "#fff", boxShadow: "0px 0px 40px rgba(255, 150, 45, 0.06)" }}>
                <AutoColumn gap="md" mobileView padding="2rem" mobilePadding="14px 12px">
                  <StyledText>Transaction Settings</StyledText>
                  <TransactionSettings
                    rawSlippage={userSlippageTolerance}
                    setRawSlippage={setUserslippageTolerance}
                    deadline={ttl}
                    setDeadline={setTtl}
                  />
                  <StyledText>Interface Settings</StyledText>
                  <RowBetween align="strech">
                    <RowFixed flexDirection="column" align="flex-start">
                      <StyledTYPE>Toggle Expert Mode</StyledTYPE>
                      <Toggle
                        id="toggle-expert-mode-button"
                        isActive={expertMode}
                        toggle={
                          expertMode
                            ? () => {
                                toggleExpertMode();
                                setShowConfirmation(false);
                              }
                            : () => {
                                toggle();
                                setShowConfirmation(true);
                              }
                        }
                      />
                    </RowFixed>
                    <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
                  </RowBetween>
                  <RowBetween align="strech">
                    <RowFixed flexDirection="column" align="flex-start">
                      <StyledTYPE>Disable Multihops</StyledTYPE>
                      <Toggle
                        id="toggle-disable-multihop-button"
                        isActive={singleHopOnly}
                        toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
                      />
                    </RowFixed>
                    <QuestionHelper text="Restricts swaps to direct pairs only." />
                  </RowBetween>
                </AutoColumn>
              </div>
            </motion.div>
          </MenuFlyout>
        ) : null}
      </AnimatePresence>
    </StyledMenu>
  );
}
