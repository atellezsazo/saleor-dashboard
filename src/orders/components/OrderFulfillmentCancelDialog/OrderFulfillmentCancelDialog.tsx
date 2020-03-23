import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import { buttonMessages } from "@saleor/intl";
import { OrderErrorFragment } from "@saleor/orders/types/OrderErrorFragment";
import FormSpacer from "@saleor/components/FormSpacer";
import getOrderErrorMessage from "@saleor/utils/errors/order";

export interface FormData {
  restock: boolean;
}

const useStyles = makeStyles(
  theme => ({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  }),
  { name: "OrderFulfillmentCancelDialog" }
);

export interface OrderFulfillmentCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose();
  onConfirm(data: FormData);
}

const OrderFulfillmentCancelDialog: React.FC<OrderFulfillmentCancelDialogProps> = props => {
  const { confirmButtonState, errors, open, onConfirm, onClose } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <Form initial={{ restock: true }} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Cancel Fulfillment"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <FormattedMessage defaultMessage="Are you sure you want to cancel this fulfillment?" />
              </DialogContentText>
              <ControlledCheckbox
                checked={data.restock}
                label={intl.formatMessage({
                  defaultMessage: "Restock items?",
                  description: "switch button"
                })}
                name="restock"
                onChange={change}
              />
              {errors.length > 0 && (
                <>
                  <FormSpacer />
                  {errors.map(err => (
                    <DialogContentText color="error">
                      {getOrderErrorMessage(err, intl)}
                    </DialogContentText>
                  ))}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                transitionState={confirmButtonState}
                className={classes.deleteButton}
                variant="contained"
                onClick={submit}
              >
                <FormattedMessage
                  defaultMessage="Cancel fulfillment"
                  description="button"
                />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
OrderFulfillmentCancelDialog.displayName = "OrderFulfillmentCancelDialog";
export default OrderFulfillmentCancelDialog;
