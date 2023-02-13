// if new row is inserted with unquine id//
    if (row.isNewInsert) {
      const copied = { ...row };
      copied[columnName] = value;
      const copiedData = [...newInserted];
      const foundRowIndex = copiedData.findIndex(
        (item) => item._id === row._id
      );
      if (foundRowIndex === -1) return;

      copiedData[foundRowIndex] = copied;
      setNewInserted(copiedData);
      return;
    }
    // console.log({ row });
    // if (rowsBeingUpdated[rowIndex]) return;
    const copiedRowsBeingUpdated = {
      ...rowsBeingUpdated,
      [row.id]: {
        ...rowsBeingUpdated[row.id],
        id: row.id,
        [columnName]: value,
      },
    };

    setRowsBeingUpdated(copiedRowsBeingUpdated);
  };

  const handleUpdate = (e) => {
    const isEmpty = Object.keys(rowsBeingUpdated).length === 0;

    if (isEmpty) return;

    const payloadData = { ...rowsBeingUpdated };

    const payload = {
      subRoute: `update${tabNameMap[selectedTab]}`,
      data: payloadData,
    };
    updateLinMatrix(payload)
      .then((res) => {
        if (res.hasOwnProperty("success") && res.success) {
          toast.success("Line Matrix saved successfully.");
          setRowsBeingUpdated({});
          console.log({ res: res.data });
        }
      })
      .catch((err) => {
        console.log(err[0]);
        toast.error(err[0]);
      });
  };

  const addHandler = (row) => {
    const { id, ...rest } = row;
    const foundRowIndex = data.findIndex((item) => item.id === id);
    if (foundRowIndex === -1) return;
    const newRowsData = [...data];
    const newRow = { isNewInsert: true, ...rest, _id: uuidv4() };
    newRowsData.splice(foundRowIndex + 1, 0, newRow);

    const copiedNewInserted = [...newInserted];
    copiedNewInserted.push(newRow);

    setNewInserted(copiedNewInserted);
    setmatrixData(newRowsData);
  };

  const handleBulkSave = (e) => {
    if (!newInserted.length) return;

    const p = newInserted.map((item, i) => {
      const { _id, isNewInsert, ...rest } = item;

      return {
        id: i,
        ...rest,
      };
    });

    console.log({ paylodBulkInsert: p });
    const payload = {
      subRoute: `update${tabNameMap[selectedTab]}`,
      data: p,
    };
    updateLinMatrix(payload)
      .then((res) => {
        if (res.hasOwnProperty("success") && res.success) {
          toast.success("Line Matrix saved successfully.");
          setNewInserted([]);
          console.log({ res: res.data });
        }
      })
      .catch((err) => {
        console.log(err[0]);
        toast.error(err[0]);
      });
  };
