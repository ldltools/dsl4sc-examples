protocol
    settle;
    bond_transfer;
    (
        (bond_transfer_err; rollback)
        +
        cash_transfer; (cash_transfer_err; rollback)?
    );
    END
;;
