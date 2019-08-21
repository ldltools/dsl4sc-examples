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

variable
bond_transferred, cash_transferred;

property
!bond_transferred & !cash_transferred;  // initial condition

//
// safety property written in temporal logic
//
// – both transferred or neither
// (atomicity of the "settle" transaction)

[](last -> bond_transferred & cash_transferred |
    !bond_transferred & !cash_transferred);


rule

on bond_transfer ensure bond_transferred;
on cash_transfer ensure cash_transferred;
on rollback ensure !bond_transferred & !cash_transferred;

except on bond_transfer, rollback preserve bond_transferred;
except on cash_transfer, rollback preserve cash_transferred;
