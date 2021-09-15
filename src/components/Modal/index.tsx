import React from "react";
import styled, { css, keyframes } from "styled-components";
import { animated, useTransition, useSpring } from "@react-spring/web";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { isMobile } from "react-device-detect";
import "@reach/dialog/styles.css";
import { useGesture } from "react-use-gesture";
import Header from "components/Header";
import Footer from "components/Footer";
import "@reach/dialog/styles.css";

const AnimatedDialogOverlay = animated(DialogOverlay);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)<{
  background?: string;
  justify?: string;
  mediaWalletModal?: boolean;
}>`
  &[data-reach-dialog-overlay] {
    z-index: 6;
    overflow: hidden;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: ${({ justify }) => (justify ? justify : "center")};
    background-color: ${({ background }) => (background ? background : "rgba(252, 253, 255, 0.6)")};
    @media (max-width: 500px) {
      top: ${({ mediaWalletModal }) => mediaWalletModal && "none"};
    }
  }
`;

const AnimatedDialogContent = animated(DialogContent);
// destructure to not pass custom props to Dialog DOM element
/* eslint-disable @typescript-eslint/no-unused-vars */
const StyledDialogContent = styled(
  ({
    border,
    minHeight,
    maxHeight,
    mobile,
    isOpen,
    backgroundModal,
    userMigrationModule,
    maxWidth,
    borderRadius,
    ...rest
  }) => <AnimatedDialogContent {...rest} />
).attrs({
  /* eslint-enable @typescript-eslint/no-unused-vars */
  "aria-label": "dialog",
})`
  overflow-y: ${({ mobile }) => (mobile ? "scroll" : "hidden")};

  &[data-reach-dialog-content] {
    width: 100%;
    margin: auto;
    background: ${({ backgroundModal }) => (backgroundModal ? backgroundModal : "#ffffff")};
    @media (max-width: 1020px) {
      margin: ${({ userMigrationModule }) => (userMigrationModule ? "53px auto 32px" : "0")};
    }
    padding: 0;
    box-shadow: ${({ shadow }) => shadow && "0 0 24px rgba(117, 100, 107, 0.19)"};
    border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : "16px")};
    overflow-y: auto;
    overflow-x: hidden;

    border: ${({ border }) => (border ? "1px solid rgb(243, 132, 30)" : "1px solid #FADDBC")};
    box-shadow: 0px 0px 24px rgba(117, 100, 107, 0.2);
    align-self: ${({ mobile }) => (mobile ? "flex-end" : "center")};

    max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : "501px")};
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight};
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      ${
        mobile &&
        css`
          border-radius: 12px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      }
    `}
  }
`;

interface ModalProps {
  isOpen?: boolean;
  onDismiss: () => void;
  minHeight?: number | false;
  maxHeight?: string;
  initialFocusRef?: React.RefObject<any>;
  children?: React.ReactNode;
  border?: boolean;
  maxWidth?: string;
  background?: string;
  userMigrationModule?: boolean;
  backgroundModal?: string;
  justify?: string;
  radius?: string;
  isAccount?: boolean;
  mediaWalletModal?: boolean;
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight,
  initialFocusRef,
  children,
  border,
  maxWidth,
  background,
  userMigrationModule,
  backgroundModal,
  justify,
  radius,
  mediaWalletModal,
}: ModalProps) {
  const fadeTransition: any = useTransition(isOpen, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const [{ y }, set]: any = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }));
  const bind = useGesture({
    onDrag: (state) => {
      set({
        y: state.down ? state.movement[1] : 0,
      });
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss();
      }
    },
  });

  return (
    <>
      {fadeTransition((styles: any, item: any, key: any) => {
        return (
          item && (
            <StyledDialogOverlay
              key={key}
              style={styles}
              onDismiss={onDismiss}
              initialFocusRef={initialFocusRef}
              background={background}
              justify={justify}
              mediaWalletModal={mediaWalletModal}
            >
              {userMigrationModule && <Header />}
              <StyledDialogContent
                backgroundModal={backgroundModal}
                maxWidth={maxWidth}
                border={border}
                borderRadius={radius}
                {...(isMobile
                  ? {
                      ...bind(),
                      style: { transform: y?.interpolate((y: number) => `translateY(${y > 0 ? y : 0}px)`) },
                    }
                  : {})}
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
                userMigrationModule={userMigrationModule}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
              {userMigrationModule && <Footer />}
            </StyledDialogOverlay>
          )
        );
      })}
    </>
  );
}

interface UniqeModalProps {
  children?: any;
  isOpen?: boolean;
  minHeight?: string;
}

export const UniqeModal = ({ children, isOpen, minHeight }: UniqeModalProps) => {
  return isOpen ? (
    <StyledUniqueModal minHeight={minHeight}>
      <StyledDialogContent>
        <StyledResponsiveWrapper>
          <StyledModal>{children}</StyledModal>
        </StyledResponsiveWrapper>
      </StyledDialogContent>
    </StyledUniqueModal>
  ) : null;
};

const mobileKeyframes = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
`;

const keyFrame = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledUniqueModal = styled(StyledDialogOverlay)<{ minHeight?: string }>`
  height: 100vh;
  &[data-reach-dialog-overlay] {
    z-index: 6;
    overflow: hidden;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: ${({ justify }) => (justify ? justify : "center")};
    background-color: ${({ background }) => (background ? background : "rgba(252, 253, 255, 0.6)")};
    animation: ${keyFrame} 0.3s forwards ease-out;
    @media (max-width: 500px) {
      justify-content: flex-end;
      animation: ${mobileKeyframes} 0.3s forwards ease-out;
    }
  }
`;

const StyledResponsiveWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 512px;
  max-height: 90vh;
  margin: auto;
  background: #fff;
`;

const StyledModal = styled.div`
  padding: 0 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: 0;
`;
