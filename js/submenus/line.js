KiddoPaint.Submenu.line = [{
        name: 'Size 1',
        imgSrc: 'img/pw1.png',
        handler: function() {
            KiddoPaint.Tools.Line.size = 1;
        }
    },
    {
        name: 'Size 5',
        imgSrc: 'img/pw2.png',
        handler: function() {
            KiddoPaint.Tools.Line.size = 5;
        }
    },
    {
        name: 'Size 10',
        imgSrc: 'img/pw3.png',
        handler: function() {
            KiddoPaint.Tools.Line.size = 9;
        }
    },
    {
        name: 'Size 25',
        imgSrc: 'img/pw4.png',
        handler: function() {
            KiddoPaint.Tools.Line.size = 13;
        }
    },
    {
        name: 'Size 100',
        imgSrc: 'img/pw5.png',
        handler: function() {
            KiddoPaint.Tools.Line.size = 17;
        }
    },
    {
        name: 'Size 150',
        imgSrc: 'img/pw6.png',
        handler: function() {
            KiddoPaint.Tools.Line.size = 25;
        }
    },


    {
        name: 'spacer',
        invisible: true,
        handler: true
    },

    {
        name: 'Solid Line',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Solid)
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Solid(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Sparse Dots',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Partial1);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Medium Dots',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Partial2);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Dense Dots',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Partial3);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Artifact Pattern',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.PartialArtifactAlias);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.PartialArtifactAlias(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Speckles',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Speckles);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Speckles(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Stripes',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Stripes);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Stripes(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Thatch',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Thatch);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Thatch(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Shingles',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Shingles);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Shingles(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Bubbles',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Bubbles);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Bubbles(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Diamond',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Diamond);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Diamond(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Ribbon',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Ribbon);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Ribbon(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Sand',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Sand);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Sand(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Brick',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Brick);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Brick(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Chevron',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Chevron);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Chevron(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Stairs',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Stairs);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Stairs(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Cross',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Cross);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Cross(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Diagonal Brick',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.DiagBrick);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.DiagBrick(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Corner Stair',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.CornerStair);
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.CornerStair(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Houndstooth',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Houndstooth)
        },
        handler: function() {
            KiddoPaint.Tools.Line.stomp = true;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.Houndstooth(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Rainbow',
        imgSrc: 'img/tool-unknown.png',
        handler: function() {
            KiddoPaint.Tools.Line.stomp = false;
            KiddoPaint.Tools.Line.texture = function() {
                return KiddoPaint.Textures.RSolid();
            }
        }
    }
];