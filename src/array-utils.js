if (!Array.prototype.flatFilter) {
  Array.prototype.flatFilter = function(cb) {
    return this.filter(cb).reduce(a => a)
  }
}
