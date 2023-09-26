import prisma from "../db";

// get all
export const getUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      update: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.update];
  }, []);

  res.json({ data: updates });
};

// get only one update

export const getOneUpdate = async (req, res) => {
  const update = await prisma.update.findFirst({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: update });
};

// create a update

export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    res.json({ message: "Doesn't belong to user" });
  }

  const update = await prisma.update.create({
    data: {
        title: req.body.title,
        body: req.body.body,
        product: {
            connect: {
                id: product.id
            }
        }
    }
  });

  res.json({ data: update });
};

export const updateUpdate = async (req, res) => {
  const product = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      update: true,
    },
  });

  const updates = product.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.update];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "Nope" });
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};

export const deleteUpdate = async (req, res) => {
  const product = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      update: true,
    },
  });

  const updates = product.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.update];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "Nope" });
  }

  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deleted });
};
