import { CircularProgress, TextField, Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import { useChannelsList } from "@saleor/channels/queries";
import ActionDialog from "@saleor/components/ActionDialog";
import { useChannelsSearch } from "@saleor/components/ChannelsAvailabilityDialog/utils";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { IMessage } from "@saleor/components/messages";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import useForm from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import commonErrorMessages from "@saleor/utils/errors/common";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { useGiftCardDeleteDialogContentStyles as useProgressStyles } from "../../components/GiftCardDeleteDialog/styles";
import { useUpdateBalanceDialogStyles as useStyles } from "../GiftCardUpdateBalanceDialog/styles";
import { getGiftCardErrorMessage } from "../messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardResendCodeDialogMessages as messages } from "./messages";
import { useGiftCardResendCodeMutation } from "./mutations";
import { GiftCardResend } from "./types/GiftCardResend";
import { handleCheckboxChange, useDialogFormReset } from "./utils";

export interface GiftCardResendCodeFormData {
  email: string;
  channelId: string;
}

const GiftCardResendCodeDialog: React.FC<DialogActionHandlersProps> = ({
  open,
  closeDialog
}) => {
  const intl = useIntl();
  const notify = useNotifier();
  const classes = useStyles();
  const progressClasses = useProgressStyles();

  const [consentSelected, setConsentSelected] = useState(false);

  const { data: channelsData, loading: loadingChannels } = useChannelsList({});

  const channels = channelsData?.channels;

  const { onQueryChange, filteredChannels } = useChannelsSearch(channels);

  const initialFormData: GiftCardResendCodeFormData = {
    email: "",
    // TMP
    channelId: ""
  };

  const {
    giftCard: { id }
  } = useGiftCardDetails();

  const handleSubmit = async ({
    email,
    channelId
  }: GiftCardResendCodeFormData) => {
    const result = await resendGiftCardCode({
      variables: {
        input: {
          id,
          email: email ? email : null,
          channelSlug: channels?.find(getById(channelId))?.slug
        }
      }
    });

    return result?.data?.giftCardResend?.errors;
  };

  const { data, change, submit, reset } = useForm(
    initialFormData,
    handleSubmit
  );

  const onCompleted = (data: GiftCardResend) => {
    const errors = data?.giftCardResend?.errors;

    const notifierData: IMessage = !!errors?.length
      ? {
          status: "error",
          text: intl.formatMessage(commonErrorMessages.unknownError)
        }
      : {
          status: "success",
          text: intl.formatMessage(messages.successResendAlertText)
        };

    notify(notifierData);

    if (!errors.length) {
      closeDialog();
      reset();
    }
  };

  const [
    resendGiftCardCode,
    resendGiftCardCodeOpts
  ] = useGiftCardResendCodeMutation({
    onCompleted
  });

  const { loading, status, data: submitData } = resendGiftCardCodeOpts;

  const { formErrors } = useDialogFormReset({
    open,
    reset,
    apiErrors: submitData?.giftCardResend?.errors,
    keys: ["email"]
  });

  useEffect(reset, [consentSelected]);

  return (
    <ActionDialog
      maxWidth="sm"
      open={open}
      onConfirm={submit}
      confirmButtonLabel={intl.formatMessage(messages.submitButtonLabel)}
      onClose={closeDialog}
      title={intl.formatMessage(messages.title)}
      confirmButtonState={status}
      disabled={loading}
    >
      {loadingChannels ? (
        <div className={progressClasses.progressContainer}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Typography>{intl.formatMessage(messages.description)}</Typography>
          <VerticalSpacer />
          <SingleAutocompleteSelectField
            choices={mapNodeToChoice(filteredChannels)}
            name="channelId"
            label={intl.formatMessage(messages.sendToChannelSelectLabel)}
            value={data?.channelId}
            onChange={change}
            displayValue={channels.find(getById(data?.channelId))?.name}
            fetchChoices={onQueryChange}
          />
          <VerticalSpacer spacing={0.5} />
          <ControlledCheckbox
            name="differentMailConsent"
            label={intl.formatMessage(messages.consentCheckboxLabel)}
            checked={consentSelected}
            onChange={(event: React.ChangeEvent<any>) =>
              setConsentSelected(event.target.value)
            }
          />
          <VerticalSpacer />
          <TextField
            disabled={!consentSelected}
            error={!!formErrors?.email}
            helperText={getGiftCardErrorMessage(formErrors?.email, intl)}
            name="email"
            value={data.email}
            onChange={change}
            className={classes.inputContainer}
            label={intl.formatMessage(messages.emailInputPlaceholder)}
          />
        </>
      )}
    </ActionDialog>
  );
};

export default GiftCardResendCodeDialog;
