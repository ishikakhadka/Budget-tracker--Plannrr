import TransactionTable from "./transaction.model.js";
export const isOwnerOfTransaction = async (req, res, next) => {
  const transactionId = req.params.id;
  const transaction = await TransactionTable.findOne({ _id: transactionId });
  if (!transaction) {
    return res.status(404).send({ message: "transaction does not exists" });
  }
  const isOwner = transaction.userId?.equals(req.loggedInUserId);
  if (!isOwner) {
    return res
      .status(200)
      .send({ message: "You have no access to this resource" });
  }
  next();
};
